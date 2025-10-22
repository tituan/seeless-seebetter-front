// app/categories/[category]/[slug]/page.tsx
import Container from "@/components/Container";
import { API } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import s from "./article.module.scss";
import DateText from "@/components/DateText";
import { categoryLandingPath } from "@/lib/routes";
import type { Route } from "next";

export const dynamic = "force-dynamic";

type Article = {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  category: string;
  imageUrl?: string;
  content?: string;      // HTML
  author?: string;
  publishedAt?: string;  // ISO
};

type PageProps = {
  params: { category: string; slug: string }; // <- pas besoin de Promise ici
};

// Normalise la base API : on retire un éventuel suffixe /api
function getApiBase() {
  const base = API || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
  return String(base).replace(/\/api\/?$/, "");
}

async function fetchArticleByCategory(category: string, slug: string) {
  const BASE = getApiBase();
  const url = `${BASE}/api/articles/by-category/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Article;
}

async function fetchArticleBySlug(slug: string) {
  const BASE = getApiBase();
  const url = `${BASE}/api/articles/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Article;
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, slug } = params;

  // 1) try by (category, slug)
  let article: Article | null = null;
  try {
    article = await fetchArticleByCategory(category, slug);
  } catch {
    article = null;
  }

  // 2) fallback by slug only
  if (!article?._id) {
    try {
      const a2 = await fetchArticleBySlug(slug);
      if (a2?._id) {
        return <ArticleView category={category} article={a2} />;
      }
    } catch {
      // ignore
    }

    // 3) not found
    return (
      <Container>
        <div className={s.wrap}>
          <p>Article introuvable.</p>
          <div className={s.back}>
            <Link href={categoryLandingPath(category) as Route}>← Retour</Link>
          </div>
        </div>
      </Container>
    );
  }

  return <ArticleView category={category} article={article} />;
}

function ArticleView({
  category,
  article,
}: {
  category: string;
  article: Article;
}) {
  const backHref = categoryLandingPath(category) as Route;

  return (
    <Container>
      <article className={s.wrap}>
        <header className={s.header}>
          <h1 className={s.title}>{article.title}</h1>
          {article.subtitle && <p className={s.subtitle}>{article.subtitle}</p>}
          <div className={s.meta}>
            {article.author ?? "SLSB"}
            <DateText iso={article.publishedAt} prefix=" — " />
          </div>
        </header>

        {article.imageUrl && (
          <div className={s.cover}>
            <Image
              src={article.imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 880px"
              className={s.coverImage}
              priority
            />
          </div>
        )}

        {article.content && (
          <div
            className={s.content}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        <div className={s.back}>
          <Link href={backHref}>← Retour aux articles</Link>
        </div>
      </article>
    </Container>
  );
}