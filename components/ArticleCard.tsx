"use client";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import styles from "@/styles/articlecard.module.scss";

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
  const date = a.publishedAt
    ? new Date(a.publishedAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  const canShowImage = isValidHttpUrl(a.imageUrl);

  // typage de href compatible Next 15
  const href =
    (a.category
      ? `/categories/${a.category}/${a.slug}`
      : `/articles/${a.slug}`) as Route;

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.imageWrap} aria-label={`Lire: ${a.title}`}>
        {canShowImage ? (
          <Image
            src={a.imageUrl as string}
            alt={a.title || "Visuel de l’article"}
            width={1280}
            height={720}
            className={styles.image}
            priority={false}
            unoptimized
          />
        ) : (
          <div className={styles.noImage}>Image indisponible</div>
        )}
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          {date && <time dateTime={a.publishedAt}>{date}</time>}
          {a.author && <span className={styles.author}>{a.author}</span>}
          {a.category && <span className={styles.category}>{a.category}</span>}
        </div>

        <h3 className={styles.title}>
          <Link href={href}>{a.title}</Link>
        </h3>

        {a.excerpt ? <p className={styles.excerpt}>{a.excerpt}</p> : <span className={styles.spacer} />}
      </div>
    </article>
  );
}
