'use client';

import { useMemo, useRef, useState } from 'react';

import Container from '@/components/Container';
import type { Shop } from '@/data/shops';
import { shops } from '@/data/shops';

import styles from './shopping.module.scss';

const featuredShop = shops[0];
const otherShops = shops.slice(1);

export default function ShoppingPage() {
  const [selectedShopId, setSelectedShopId] = useState<string>(featuredShop.id);
  const mapSectionRef = useRef<HTMLDivElement | null>(null);

  const selectedShop: Shop = useMemo(
    () => shops.find((shop) => shop.id === selectedShopId) ?? featuredShop,
    [selectedShopId]
  );

  const handleSelectShop = (shopId: string) => {
    setSelectedShopId(shopId);
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                {featuredShop.name}
              </h2>
              <p className={styles.featuredMeta}>
                {featuredShop.style} · {featuredShop.district}
              </p>
              <p className={styles.featuredAddress}>{featuredShop.address}</p>
              {featuredShop.description ? (
                <p className={styles.featuredDescription}>{featuredShop.description}</p>
              ) : null}
              <div className={styles.featuredActions}>
                <button
                  type="button"
                  className={styles.cta}
                  onClick={() => handleSelectShop(featuredShop.id)}
                >
                  Voir sur la carte
                </button>
                {featuredShop.website ? (
                  <a
                    href={featuredShop.website}
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
            D&apos;autres adresses à explorer
          </h2>
          <div className={styles.list}>
            {otherShops.map((shop) => (
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
