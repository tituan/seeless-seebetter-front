/**
 * Scrape Shinzo (https://www.shinzo.paris/fr/65-soldes?content_only=1)
 * en filtrant les promos -10/-20/-30/-40/-50%.
 *
 * ⚠️  Nécessite le cookie de session obtenu depuis ton navigateur.
 *     Exécuter avec :
 *       SHINZO_COOKIE="timer_popup=...; PrestaShop-...; ..." yarn tsx scripts/scrape-shinzo.ts
 *
 *     Tu peux récupérer la valeur complète du header `cookie` depuis l’onglet Réseau
 *     (voir la requête listée dans ton message précédent).
 */

import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = 'https://www.shinzo.paris';
const CATEGORY_PATH = '/fr/65-soldes';
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'shinzo-outlet.json');
const ALLOWED_DISCOUNTS = new Set([10, 20, 30, 40, 50]);
const MAX_PAGES = 10;

type ScrapedProduct = {
  title: string;
  url: string;
  imageUrl?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  discountPercent?: number;
  availability?: string;
};

function toAbsolute(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return new URL(url, BASE_URL).toString();
}

function clean(text?: string | null): string | undefined {
  if (!text) return undefined;
  return text.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseDiscount(value?: string | null): number | undefined {
  if (!value) return undefined;
  const match = value.match(/(-?\d+)\s*%/);
  if (!match) return undefined;
  return Math.abs(Number(match[1]));
}

async function fetchPage(page: number, cookie: string): Promise<string | null> {
  const url =
    page === 1
      ? `${BASE_URL}${CATEGORY_PATH}?content_only=1`
      : `${BASE_URL}${CATEGORY_PATH}?content_only=1&p=${page}`;

  console.log(`➡️  Shinzo page ${page}: ${url}`);

  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141 Safari/537.36',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Cookie: cookie,
    },
  });

  if (!response.ok) {
    console.warn(`   ⚠️  HTTP ${response.status} — arrêt du scraping`);
    return null;
  }

  const html = await response.text();
  if (!html || html.length < 200) {
    console.warn('   ⚠️  Réponse vide ou inattendue (peut-être captcha ou cookie expiré).');
    return null;
  }

  return html;
}

function extractProducts(html: string): ScrapedProduct[] {
  const productBlocks =
    html.match(
      /<div itemscope="" itemtype="http:\/\/schema\.org\/Product" class="[^"]*product-item[^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g
    ) ?? [];

  console.log(`   → ${productBlocks.length} cartes détectées`);

  const products: ScrapedProduct[] = [];

  for (const block of productBlocks) {
    const discountText = clean(block.match(/<span class="sale">([\s\S]*?)<\/span>/i)?.[1]);
    const discountPercent = parseDiscount(discountText);
    if (!discountPercent || !ALLOWED_DISCOUNTS.has(discountPercent)) {
      continue;
    }

    const href =
      block.match(/<a[^>]*class="[^"]*product_img_link[^"]*"[^>]*href="([^"]+)"/i)?.[1] ??
      block.match(/<a[^>]*class="[^"]*link-declinaison-product[^"]*"[^>]*href="([^"]+)"/i)?.[1];
    if (!href) continue;

    const title =
      clean(
        block.match(/<h3[^>]*class="product-name"[^>]*>\s*<a[^>]*title="([^"]+)"/i)?.[1] ??
          block.match(/<h3[^>]*class="product-name"[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/i)?.[1]
      ) ?? 'Produit sans nom';

    const imageUrl =
      block.match(/<img[^>]*data-src="([^"]+)"/i)?.[1] ??
      block.match(/<img[^>]*src="([^"]+)"/i)?.[1];

    const price =
      clean(
        block.match(/<span class="price product-price[^"]*"[^>]*>([\s\S]*?)<\/span>/i)?.[1] ??
          block.match(/<span class="price"[^>]*>([\s\S]*?)<\/span>/i)?.[1]
      ) ?? undefined;

    const originalPrice =
      clean(
        block.match(/<span class="old-price product-price"[^>]*>([\s\S]*?)<\/span>/i)?.[1] ??
          block.match(/<span class="regular-price"[^>]*>([\s\S]*?)<\/span>/i)?.[1]
      ) ?? undefined;

    const availability = clean(block.match(/<span class="av">([\s\S]*?)<\/span>/i)?.[1]) ?? undefined;

    products.push({
      title,
      url: toAbsolute(href),
      imageUrl: toAbsolute(imageUrl),
      price,
      originalPrice,
      discount: discountText ?? `-${discountPercent}%`,
      discountPercent,
      availability,
    });
  }

  return products;
}

async function scrape() {
  const cookie = process.env.SHINZO_COOKIE;
  if (!cookie) {
    console.error(
      '❌  Variable d’environnement SHINZO_COOKIE manquante.\n' +
        '    Exemple : SHINZO_COOKIE="timer_popup=...; PrestaShop-..." yarn tsx scripts/scrape-shinzo.ts'
    );
    process.exit(1);
  }

  const allProducts: ScrapedProduct[] = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const html = await fetchPage(page, cookie);
    if (!html) break;

    const products = extractProducts(html);
    if (products.length === 0) break;

    allProducts.push(...products);
  }

  console.log(`🛍️  ${allProducts.length} produits promo retenus (-10/-20/-30/-40/-50%)`);
  await writeFile(OUTPUT_PATH, JSON.stringify(allProducts, null, 2), 'utf-8');
  console.log(`✅ Données sauvegardées dans ${OUTPUT_PATH}`);
}

scrape().catch((err) => {
  console.error('❌ Erreur lors du scraping Shinzo:', err);
  process.exit(1);
});
