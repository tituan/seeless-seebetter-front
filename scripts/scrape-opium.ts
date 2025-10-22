/**
 * Script de scraping (Playwright) pour récupérer les produits soldés
 * sur https://www.opiumparis.com/fr/75-soldes et les enregistrer dans
 * data/opium-outlet.json.
 *
 * ▶️ Pré-requis (depuis `frontend/`) :
 *    yarn add -D playwright tsx
 *    yarn playwright install chromium
 *
 * ▶️ Exécution :
 *    yarn tsx scripts/scrape-opium.ts
 *
 * ⚠️ Les sélecteurs CSS ci-dessous correspondent au markup du 13/10/2025.
 *     Vérifiez-les si le site change.
 */

import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const TARGET_URL = 'https://www.opiumparis.com/fr/75-soldes';
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'opium-outlet.json');

type ScrapedProduct = {
  title: string;
  url: string;
  imageUrl?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  brand?: string;
  sizes?: string[];
};

function toAbsolute(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  if (raw.startsWith('//')) return `https:${raw}`;
  if (raw.startsWith('http')) return raw;
  return new URL(raw, TARGET_URL).toString();
}

async function scrape() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36',
  });

  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 120_000 });

  // Popup cookies (Didomi)
  const cookieButton = page.locator('button[id^="didomi-notice-agree"]');
  if (await cookieButton.first().isVisible().catch(() => false)) {
    await cookieButton.first().click({ trial: false }).catch(() => undefined);
  }

  const cards = page.locator('article.js-product-miniature');
  const count = await cards.count();
  const products: ScrapedProduct[] = [];

  for (let i = 0; i < count; i += 1) {
    const card = cards.nth(i);

    const anchor = card.locator('a.product-thumbnail').first();
    const href = toAbsolute(await anchor.getAttribute('href'));
    if (!href) continue;

    const title =
      (await card.locator('.product-title a').first().textContent().catch(() => undefined))
        ?.trim() || 'Produit sans nom';

    const brand =
      (await card.locator('.product-manufacturer').first().textContent().catch(() => undefined))
        ?.trim() || undefined;

    const discount =
      (await card.locator('.product-discount').first().textContent().catch(() => undefined))
        ?.trim() || undefined;

    const price =
      (await card
        .locator('.product-price-and-shipping [itemprop="price"], .product-price-and-shipping .price')
        .first()
        .textContent()
        .catch(() => undefined))
        ?.replace(/\s+/g, ' ')
        .trim() || undefined;

    const originalPrice =
      (await card
        .locator('.product-price-and-shipping .regular-price')
        .first()
        .textContent()
        .catch(() => undefined))
        ?.replace(/\s+/g, ' ')
        .trim() || undefined;

    const imageUrl =
      toAbsolute(await anchor.locator('img').first().getAttribute('data-src')) ||
      toAbsolute(await anchor.locator('img').first().getAttribute('data-full-size-image-url')) ||
      toAbsolute(await anchor.locator('img').first().getAttribute('src'));

    const sizes = await card
      .locator('.product-sizes .list-sizes li:not(.out-of-stock) a')
      .allTextContents()
      .catch(() => []);

    products.push({
      title,
      url: href,
      imageUrl,
      price,
      originalPrice,
      discount,
      brand,
      sizes: sizes.map((s) => s.trim()).filter(Boolean),
    });
  }

  await browser.close();

  if (!products.length) {
    throw new Error(
      'Scraping terminé mais aucun produit détecté. Vérifiez les sélecteurs CSS ou la page cible.'
    );
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`✅ ${products.length} produits sauvegardés dans ${OUTPUT_PATH}`);
}

scrape().catch((err) => {
  console.error('❌ Erreur lors du scraping Opium:', err);
  process.exit(1);
});
