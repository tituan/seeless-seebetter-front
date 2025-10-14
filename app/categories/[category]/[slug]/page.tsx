import Container from "@/components/Container";
import { API, fetchJSON } from "@/lib/api";
import Link from "next/link";
import s from "./article.module.scss";
import DateText from "@/components/DateText";
import { categoryLandingPath } from "@/lib/routes";
import type { Route } from "next"; // ✅ pour typed routes

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

// ✅ sur Next 15, params est asynchrone
type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export default async function ArticlePage({ params }: PageProps) {
  const { category, slug } = await params;

  // 🔹 On tente d’abord via /by-category/:category/:slug
  const byCategoryUrl = `${API}/api/articles/by-category/${category}/${slug}`;
  let article: Article | null = null;

  try {
    article = await fetchJSON<Article>(byCategoryUrl);
  } catch {
    article = null;
  }

  // 🔹 Si non trouvé, fallback sur /api/articles/:slug
  if (!article?._id) {
    try {
      const a2 = await fetchJSON<Article>(`${API}/api/articles/${slug}`);
      if (a2?._id) {
        return <ArticleView category={category} article={a2} />;
      }
    } catch {
      // rien
    }

    // 🔹 Si toujours rien : erreur + lien retour
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

// ✅ Composant d’affichage principal
function ArticleView({
  category,
  article,
}: {
  category: string;
  article: Article;
}) {
  const backHref = categoryLandingPath(category) as Route; // ✅ typed route

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

        {/* ✅ Image principale */}
        {article.imageUrl && (
          <div className={s.cover}>
            <img src={article.imageUrl} alt="" />
          </div>
        )}

        {/* ✅ Contenu HTML */}
        {article.content && (
          <div
            className={s.content}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {/* ✅ Bouton retour vers la bonne section */}
        <div className={s.back}>
          <Link href={backHref}>← Retour aux articles</Link>
        </div>
      </article>
    </Container>
  );
}