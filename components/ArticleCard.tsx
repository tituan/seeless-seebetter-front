"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/articlecard.module.scss";
// import styles from "@/styles/feedarticle.module.scss";


export type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  category?: string;
  publishedAt?: string;
};

function isValidHttpUrl(u?: string) {
  if (!u) return false;
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ArticleCard({ a }: { a: Article }) {
  const dateText = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  const canShowImage = isValidHttpUrl(a.imageUrl);

  // Lien détail robuste (encodage des segments)
  const href = a.category
    ? `/categories/${encodeURIComponent(a.category)}/${encodeURIComponent(a.slug)}`
    : `/articles/${encodeURIComponent(a.slug)}`;

  return (
    <article className={styles.card}>
      {/* Image */}
      <Link href={href} className={styles.imageWrap} aria-label={`Lire: ${a.title}`}>
        {canShowImage ? (
          <Image
            src={a.imageUrl as string}
            alt={a.title || "Visuel de l’article"}
            width={1280}
            height={720}
            className={styles.image}
            // Décommente en dev si tu veux éviter l’optimiseur
            // unoptimized
            priority={false}
          />
        ) : (
          <div className={styles.noImage}>Image indisponible</div>
        )}
      </Link>

      {/* Meta */}
      <div className={styles.meta}>
        {dateText && <time dateTime={a.publishedAt}>{dateText}</time>}
        {a.author && <span className={styles.author}>{a.author}</span>}
        {a.category && <span className={styles.category}>{a.category}</span>}
      </div>

      {/* Titre */}
      <h3 className={styles.title}>
        <Link href={href}>{a.title}</Link>
      </h3>

      {/* Extrait */}
      {a.excerpt && <p className={styles.excerpt}>{a.excerpt}</p>}
    </article>
  );
}