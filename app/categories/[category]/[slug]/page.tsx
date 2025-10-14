import { API, fetchJSON } from "@/lib/api";
import { isCategory } from "@/lib/categories";

export const dynamic = "force-dynamic";

type Article = {
  title: string;
  subtitle?: string;
  content?: string;
  author?: string;
  publishedAt?: string;
  imageUrl?: string;
};

type PageProps = {
  params: { category: string; slug: string };
};

export default async function ArticlePage({ params }: PageProps) {
  const { category, slug } = params;
  if (!isCategory(category)) return <div className="p-8">Catégorie inconnue</div>;

  const article = await fetchJSON<Article>(
    `${API}/api/articles/by-category/${category}/${slug}`
  );

  return (
    <article className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-semibold">{article.title}</h1>
      {article.subtitle && <p className="opacity-70 mt-2">{article.subtitle}</p>}
      <div className="text-xs opacity-60 mt-2">
        {(article.author ?? "SLSB") +
          (article.publishedAt
            ? " — " + new Date(article.publishedAt).toLocaleDateString("fr-FR")
            : "")}
      </div>
      {article.imageUrl && (
        <img src={article.imageUrl} alt="" className="mt-6 w-full rounded-xl" />
      )}
      {article.content && (
        <div className="prose mt-6" dangerouslySetInnerHTML={{ __html: article.content }} />
      )}
    </article>
  );
}