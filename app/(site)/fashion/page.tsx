import ArticlesFeed from "@/components/ArticleFeed";

export default function FashionPage() {
  return (
    <main className="px-6 py-12">
      <h1 className="text-3xl font-light mb-8">Articles Mode</h1>

      {/* Liste des articles filtrés par la catégorie "fashion" */}
      <ArticlesFeed categories={["fashion"]} pageSize={6} />
    </main>
  );
}