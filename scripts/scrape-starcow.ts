/**
 * Script de scraping hors-ligne (Playwright) pour récupérer les produits
 * de la page outlet Starcow et les enregistrer en JSON local.
 *
 * ▶️ Pré-requis (à lancer une seule fois dans le dossier frontend) :
 *    npm install -D playwright
 *    npx playwright install chromium
 *
 * ▶️ Exécution :
 *    npx ts-node scripts/scrape-starcow.ts
 *    # ou, si ts-node n'est pas installé :
 *    npx tsx scripts/scrape-starcow.ts
 *
 * Le script crée/écrase data/starcow-outlet.json avec les données scrapées.
 *
 * ⚠️ Les sélecteurs CSS ci-dessous correspondent à la structure actuelle
 *     du site au 2025-10-13. Vérifiez et ajustez-les si le markup change.
 */

import { chromium, type Page } from 'playwright';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const TARGET_URL = 'https://www.starcowparis.com/collections/outlet';
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'starcow-outlet.json');

type ScrapedProduct = {
  title: string;
  url: string;
  imageUrl?: string;
  price?: string;
  brand?: string;
  originalPrice?: string;
  discount?: string;
  discountPercent?: number;
  sizes?: string[];
};

function toAbsolute(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  if (raw.startsWith('//')) return `https:${raw}`;
  if (raw.startsWith('/')) return new URL(raw, TARGET_URL).toString();
  if (raw.startsWith('http')) return raw;
  return raw;
}

function parseDiscount(discount?: string | null): number | null {
  if (!discount) return null;
  const match = discount.match(/(-?\d+)\s*%/);
  if (!match) return null;
  return Math.abs(Number(match[1]));
}

async function autoScroll(page: Page, steps = 6, wait = 600) {
  for (let i = 0; i < steps; i += 1) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 0.9);
    });
    await page.waitForTimeout(wait);
  }
}

async function scrape() {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36',
  });

  console.log('➡️  Navigation vers', TARGET_URL);
  await page.goto(TARGET_URL, {
    waitUntil: 'networkidle',
    timeout: 120_000,
  });

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);

  // Éventuellement fermer un popup d'acceptation cookies si présent
  const cookieButton = await page.locator('button:has-text("Tout accepter")').first();
  if (await cookieButton.isVisible().catch(() => false)) {
    await cookieButton.click().catch(() => undefined);
  }

  console.log('📜 Scroll automatisé pour charger davantage de produits…');
  await autoScroll(page, 8, 700);
  await autoScroll(page, 4, 900); // second passe pour les lazy-load

  await page.waitForSelector('.c-card-product', { timeout: 20000 }).catch(() => undefined);

const cards = page.locator('.c-card-product');
const count = await cards.count();
console.log(`✅ ${count} cartes détectées (avant filtrage)`);

const products: ScrapedProduct[] = [];

for (let i = 0; i < count; i += 1) {
  const card = cards.nth(i);

  const anchor = card.locator('a.u-extend-href').first();
  const href = toAbsolute(await anchor.getAttribute('href'));
  if (!href) continue;

    const anchorTitle = await anchor.textContent().catch(() => undefined);
  const fallbackTitle = await card
    .locator('.u-text-14, .c-card-product__title')
    .first()
    .textContent()
    .catch(() => undefined);
    const title =
      anchorTitle?.trim() || fallbackTitle?.trim() || 'Produit sans nom';

    const promoBadge = await card
      .locator('.c-badge span, [class*="discount"], .badge--discount, .product-discount')
      .first()
      .textContent()
      .catch(() => undefined);

    const badgeDiscount = parseDiscount(promoBadge);

    if (!badgeDiscount) {
      console.log(`⏭️  Produit ignoré (pas de pourcentage promo affiché) : ${title}`);
      continue;
    }

    const rawPrice = await card
      .locator('.t-surtitle--price')
      .first()
      .textContent()
      .catch(() => undefined);
    const price = rawPrice ? rawPrice.replace(/\s+/g, ' ').trim() : undefined;

    const rawOriginalPrice = await card
      .locator('.t-surtitle--price + .t-surtitle--price, .old-price, del')
      .first()
      .textContent()
      .catch(() => undefined);
    const originalPrice = rawOriginalPrice
      ? rawOriginalPrice.replace(/\s+/g, ' ').trim()
      : undefined;

    const rawBrand = await card
      .locator('.t-surtitle')
      .first()
      .textContent()
      .catch(() => undefined);
    const brand = rawBrand ? rawBrand.trim() : undefined;

    const imageLocator = card.locator('img.c-card-product__thumbnail__img, figure img').first();
    const imageUrl =
      toAbsolute(await imageLocator.getAttribute('data-src')) ||
      toAbsolute(await imageLocator.getAttribute('data-srcset')) ||
      toAbsolute(await imageLocator.getAttribute('src'));

    if (((i + 1) % 5 === 0) || i === count - 1) {
      const keptSoFar = products.length;
      console.log(`… progression ${(i + 1)}/${count} (garde ${keptSoFar} pour l'instant)`);
    }

    products.push({
      title,
      url: href,
      imageUrl,
      price,
      originalPrice,
      brand,
      discount: promoBadge?.trim(),
      discountPercent: badgeDiscount,
    });
  }

  await browser.close();

  if (!products.length) {
    console.warn(
      "⚠️ Aucun produit promo dans les seuils demandés n'a été trouvé. Le fichier sera quand même généré (liste vide)."
    );
  } else {
    console.log(`🛍️  ${products.length} produits promo retenus (10/20/30/40/50%).`);
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`✅ ${products.length} produits sauvegardés dans ${OUTPUT_PATH}`);
}

scrape().catch((err) => {
  console.error('❌ Erreur lors du scraping Starcow:', err);
  process.exit(1);
});
