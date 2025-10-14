"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: string;
};

type Props = {
  apiBase: string;
  category: string;
  initialSkip?: number;     // ex: 4 si 4 articles déjà affichés
  pageSize?: number;        // ex: 5
  listClassName?: string;   // classes pour le <ul>
  renderItem?: (a: Article) => ReactNode; // rendu custom d’un item
};

export default function LoadMoreList({
  apiBase,
  category,
  initialSkip = 0,
  pageSize = 5,
  listClassName = "grid gap-6 md:grid-cols-2",
  renderItem,
}: Props) {
  const [items, setItems] = useState<Article[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [skip, setSkip] = useState(initialSkip);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Empêche le double fetch (StrictMode dev)
  const booted = useRef(false);

  const mergeUnique = (prev: Article[], next: Article[]) => {
    const map = new Map<string, Article>();
    for (const a of prev) map.set(a._id, a);
    for (const a of next) map.set(a._id, a);
    return Array.from(map.values());
  };

  async function fetchBatch(nextSkip: number) {
    if (loading) return;
    if (total !== null && nextSkip >= total) return;

    setLoading(true);
    setErr(null);

    try {
      const url = `${apiBase}/api/articles?category=${category}&status=published&limit=${pageSize}&skip=${nextSkip}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as { items: Article[]; total: number };

      setItems((prev) => mergeUnique(prev, data.items));
      setTotal(data.total);
      setSkip(nextSkip + data.items.length);
    } catch (e: any) {
      setErr(e?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    fetchBatch(skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canLoadMore = total === null || skip < (total ?? 0);

  return (
    <div>
      <ul className={listClassName}>
        {items.map((a) =>
          renderItem ? (
            // ✅ on ajoute une key sur l’élément retourné
            <div key={a._id}>{renderItem(a)}</div>
          ) : (
            <li key={a._id} className="border rounded-xl p-4">
              <Link
                href={`/categories/${category}/${a.slug}`}
                className="text-xl font-medium hover:underline"
              >
                {a.title}
              </Link>
              {a.excerpt && <p className="mt-2 text-sm opacity-80">{a.excerpt}</p>}
              <div className="mt-2 text-xs opacity-60">
                {(a.author ?? "SLSB") +
                  (a.publishedAt
                    ? " — " + new Date(a.publishedAt).toLocaleDateString("fr-FR")
                    : "")}
              </div>
            </li>
          )
        )}
      </ul>

      {err && <p className="mt-4 text-red-600">Erreur : {err}</p>}
      {loading && <p className="mt-4 opacity-70">Chargement…</p>}

      {canLoadMore ? (
        !loading && (
          <div className="mt-6 text-center">
            <button
              onClick={() => fetchBatch(skip)}
              className="inline-block border border-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition"
            >
              Articles suivants (+{pageSize})
            </button>
          </div>
        )
      ) : (
        <p className="mt-6 text-center opacity-70">Vous avez tout vu ✨</p>
      )}
    </div>
  );
}