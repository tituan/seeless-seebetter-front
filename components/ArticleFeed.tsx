"use client";
import { ReactNode, useEffect, useMemo, useState } from "react";
import ArticleCard, { type Article } from "./ArticleCard";
import styles from "@/styles/feedarticle.module.scss";

type Props = {
  categories?: string[];           // ex: ["fashion"]
  pageSize?: number;
  initialSkip?: number;
  renderItem?: (a: Article) => ReactNode;
  sort?: "newest" | "oldest";
  apiPath?: string;
};

export default function ArticlesFeed({
  categories = [],
  pageSize = 6,
  initialSkip = 0,
  renderItem,
  sort = "newest",
  apiPath = `${process.env.NEXT_PUBLIC_API_URL}/articles`,
}: Props) {
  const [items, setItems] = useState<Article[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [skip, setSkip] = useState(initialSkip);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoadMore = total === null ? true : items.length < total;

  const query = useMemo(() => {
    const p = new URLSearchParams();

    // backend actuel: "category" (singulier)
    if (categories.length === 1) {
      p.set("category", categories[0]);
    } else if (categories.length > 1) {
      // si tu veux réellement le multi-filtre, patch backend pour "categories" CSV -> $in
      p.set("category", categories[0]); // fallback : première catégorie
    }

    p.set("limit", String(pageSize));
    p.set("skip", String(skip));
    p.set("sort", sort);
    p.set("status", "published");
    return p.toString();
  }, [categories, pageSize, skip, sort]);

  // reset on filters change
  useEffect(() => {
    setItems([]);
    setTotal(null);
    setSkip(0);
  }, [categories.join(","), pageSize, sort]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${apiPath}?${query}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const list: Article[] = Array.isArray(data?.items) ? data.items : [];
        const tot: number = Number.isFinite(data?.total) ? data.total : list.length;

        if (cancelled) return;
        setItems(prev => [...prev, ...list]);
        setTotal(tot);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Erreur inconnue");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [apiPath, query]);

  return (
    <section className={styles.feed}>
      <ul className={styles.grid}>
        {items.map(a => (
          <li key={a._id}>{renderItem ? renderItem(a) : <ArticleCard a={a} />}</li>
        ))}
      </ul>

      {/* loader au premier fetch */}
      {loading && items.length === 0 && (
        <div className={styles.loader} aria-live="polite">
          <span></span><span></span><span></span>
        </div>
      )}

      {/* état vide */}
      {!loading && items.length === 0 && !error && (
        <p className={styles.empty}>Aucun article à afficher.</p>
      )}

      {/* CTA pagination */}
      <div className={styles.ctaWrap}>
        {canLoadMore ? (
          <button
            disabled={loading}
            onClick={() => setSkip(s => s + pageSize)}
            className={styles.cta}
          >
            {loading ? "Chargement…" : "Charger plus"}
          </button>
        ) : (
          items.length > 0 && <p className={styles.empty}>Tout est affiché.</p>
        )}
      </div>

      {/* erreur réseau */}
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}