import Container from "@/components/Container";
import { API, fetchJSON } from "@/lib/api";
import Link from "next/link";
import s from "./article.module.scss";
import DateText from "@/components/DateText";
import { categoryLandingPath } from "@/lib/routes";

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

// ⬅️ params est une Promise en Next 15
type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export default async function ArticlePage({ params }: PageProps) {
  // ✅ attendre la promesse
  const { category, slug } = await params;

  // 1) Essai par /by-category/:category/:slug
  const byCatUrl = `${API}/api/articles/by-category/${category}/${slug}`;
  let article: Article | null = null;

  try {
    article = await fetchJSON<Article>(byCatUrl);
  } catch {
    article = null;
  }

  // 2) Fallback par /api/articles/:slug
  if (!article?._id) {
    try {
      const a2 = await fetchJSON<Article>(`${API}/api/articles/${slug}`);
      if (a2?._id) {
        return <ArticleView category={category} article={a2} />;
      }
    } catch {
      // ignore
    }

    return (
      <Container>
        <div className={s.wrap}>
          <p>Article introuvable.</p>
          <div className={s.back}>
            <Link href={categoryLandingPath(category)}>← Retour</Link>
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
  const backHref = categoryLandingPath(category);

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
            <img src={article.imageUrl} alt="" />
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