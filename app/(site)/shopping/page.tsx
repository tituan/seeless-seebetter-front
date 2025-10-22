'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';

import Container from '@/components/Container';
import type { Shop } from '@/data/shops';
import { shops } from '@/data/shops';
import starcowProducts from '@/data/starcow-outlet.json';
import opiumProducts from '@/data/opium-outlet.json';

import styles from './shopping.module.scss';

type OutletProduct = {
  title: string;
  url: string;
  imageUrl?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  brand?: string;
  sizes?: string[];
};

const outletData: Record<string, OutletProduct[]> = {
  starcow: (starcowProducts as OutletProduct[]) ?? [],
  opium: (opiumProducts as OutletProduct[]) ?? [],
};

const PRODUCTS_LIMIT = 20;

export default function ShoppingPage() {
  const shopsWithProducts = shops.filter((shop) => (outletData[shop.id] ?? []).length > 0);
  const activeShops = shopsWithProducts.length > 0 ? shopsWithProducts : shops.slice(0, 1);
  const featuredShop = activeShops[0] ?? shops[0];
  const shopOptions = activeShops;

  const [selectedShopId, setSelectedShopId] = useState<string>(featuredShop.id);
  const mapSectionRef = useRef<HTMLDivElement | null>(null);
  const productSectionRef = useRef<HTMLDivElement | null>(null);

  const selectedShop: Shop = useMemo(
    () => shops.find((shop) => shop.id === selectedShopId) ?? featuredShop,
    [selectedShopId, featuredShop]
  );

  const productsForSelected = useMemo(
    () => (outletData[selectedShopId] ?? []).slice(0, PRODUCTS_LIMIT),
    [selectedShopId]
  );

  const totalProducts = (outletData[selectedShopId] ?? []).length;

  const hasProducts = productsForSelected.length > 0;
  const selectedShopShortName =
    selectedShop.name.split(' ')[0] ?? selectedShop.name;

  const handleSelectShop = (shopId: string) => {
    setSelectedShopId(shopId);
    const hasProducts = (outletData[shopId] ?? []).length > 0;
    const target = hasProducts ? productSectionRef.current : mapSectionRef.current;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <Container className={styles.introInner}>
          <div className={styles.introMeta}>
            <span className={styles.badge}>City Guide</span>
            <h1 className={styles.title}>Shopping à Paris</h1>
            <p className={styles.subtitle}>
              Boutiques coups de cœur pour dénicher pièces pointues, design et accessoires.
            </p>
          </div>
          <article className={styles.featured} aria-labelledby="featured-shop-heading">
            <div className={styles.featuredContent}>
              <span className={styles.featuredLabel}>Spot du moment</span>
              <h2 id="featured-shop-heading" className={styles.featuredName}>
                {selectedShop.name}
              </h2>
              <p className={styles.featuredMeta}>
                {selectedShop.style} · {selectedShop.district}
              </p>
              <p className={styles.featuredAddress}>{selectedShop.address}</p>
              {selectedShop.description ? (
                <p className={styles.featuredDescription}>{selectedShop.description}</p>
              ) : null}
              <div className={styles.featuredActions}>
                <button
                  type="button"
                  className={styles.cta}
                  onClick={() => handleSelectShop(selectedShop.id)}
                >
                  Voir sur la carte
                </button>
                {selectedShop.website ? (
                  <a
                    href={selectedShop.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryLink}
                  >
                    Site web
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        </Container>
      </section>

      <section className={styles.listSection} aria-labelledby="list-heading">
        <Container>
          <h2 id="list-heading" className={styles.sectionTitle}>
            Les adresses en promotion
          </h2>
          <div className={styles.list}>
            {shopOptions.map((shop) => (
              <button
                type="button"
                key={shop.id}
                className={`${styles.card} ${
                  selectedShopId === shop.id ? styles.cardActive : ''
                }`}
                onClick={() => handleSelectShop(shop.id)}
                aria-pressed={selectedShopId === shop.id}
              >
                <div className={styles.cardBody}>
                  <span className={styles.cardName}>{shop.name}</span>
                  <span className={styles.cardMeta}>
                    {shop.style} · {shop.district}
                  </span>
                  <span className={styles.cardAddress}>{shop.address}</span>
                  {shop.description ? (
                    <span className={styles.cardDescription}>{shop.description}</span>
                  ) : null}
                </div>
                <span className={styles.cardHint}>Voir sur la carte →</span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      <section
        ref={productSectionRef}
        className={styles.outletSection}
        aria-labelledby="outlet-heading"
      >
        <Container>
          <div className={styles.outletHeader}>
            <div className={styles.outletHeaderTitle}>
              <span className={styles.badgeLight}>Outlet</span>
              <span className={styles.outletShopName}>{selectedShop.name}</span>
              <h2 id="outlet-heading" className={`${styles.sectionTitle} ${styles.outletHeading}`}>
                Selection {selectedShop.name}
              </h2>
              {hasProducts ? (
                <span className={styles.outletCount}>
                  {productsForSelected.length}
                  {totalProducts > PRODUCTS_LIMIT
                    ? ` articles en promotion (sur ${totalProducts})`
                    : ' articles en promotion'}
                </span>
              ) : null}
            </div>
            <p className={styles.outletSubtitle}>
              {hasProducts
                ? `Pieces reperees dans les soldes de ${selectedShop.name}. Stocks et tarifs susceptibles d'evoluer — verifiez la disponibilite avant de vous deplacer.`
                : `Pas encore de selection active pour ${selectedShop.name}. Revenez bientot pour de nouvelles trouvailles.`}
            </p>
          </div>

          {hasProducts ? (
            <div className={styles.outletGrid}>
              {productsForSelected.map((product) => (
                <a
                  key={`${product.url}-${product.title}`}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.outletCard}
                >
                  <div className={styles.outletImageWrap}>
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={styles.outletImage}
                      />
                    ) : (
                      <span className={styles.outletNoImage}>Image indisponible</span>
                    )}
                  </div>
                  <div className={styles.outletBody}>
                    {product.brand ? (
                      <span className={styles.outletBrand}>{product.brand}</span>
                    ) : null}
                    <span className={styles.outletTitle}>{product.title}</span>

                    {product.discount || product.price || product.originalPrice ? (
                      <div className={styles.outletPriceBlock}>
                        {product.discount ? (
                          <span className={styles.outletDiscount}>{product.discount}</span>
                        ) : null}
                        {product.price || product.originalPrice ? (
                          <div className={styles.outletPrices}>
                            {product.price ? (
                              <span className={styles.outletPrice}>{product.price}</span>
                            ) : null}
                            {product.originalPrice ? (
                              <span className={styles.outletOriginalPrice}>
                                {product.originalPrice}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {product.sizes?.length ? (
                      <div className={styles.outletSizes}>
                        {product.sizes.slice(0, 6).map((size) => (
                          <span
                            key={`${product.url}-${size}`}
                            className={styles.outletSize}
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <span className={styles.outletLink}>
                      Voir sur {selectedShopShortName} →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className={styles.outletEmpty}>
              Nous travaillons sur une selection pour cette adresse. Revenez bientot.
            </p>
          )}
        </Container>
      </section>

      <section
        ref={mapSectionRef}
        className={styles.mapSection}
        aria-labelledby="map-heading"
      >
        <Container>
          <div className={styles.mapHeader}>
            <div>
              <h2 id="map-heading" className={styles.sectionTitle}>
                {selectedShop.name}
              </h2>
              <p className={styles.mapMeta}>
                {selectedShop.style} · {selectedShop.district}
              </p>
              <p className={styles.mapAddress}>{selectedShop.address}</p>
              {selectedShop.phone ? (
                <a href={`tel:${selectedShop.phone}`} className={styles.mapLink}>
                  Appeler
                </a>
              ) : null}
              {selectedShop.website ? (
                <a
                  href={selectedShop.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  Site web
                </a>
              ) : null}
            </div>
            <span className={styles.mapHint}>La carte s&apos;actualise selon votre sélection.</span>
          </div>
          <div className={styles.mapFrame}>
            <iframe
              title={`Localisation ${selectedShop.name}`}
              src={selectedShop.mapUrl}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </Container>
      </section>
    </div>
  );
}
