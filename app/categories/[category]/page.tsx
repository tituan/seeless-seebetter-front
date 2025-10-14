import { API, fetchJSON } from "@/lib/api";
import { isCategory } from "@/lib/categories";
import LoadMoreList from "@/components/LoadMoreList"; // <= ajout
import Link from "next/link";

export const dynamic = "force-dynamic";

type Article = {
  _id: string; title: string; slug: string;
  excerpt?: string; imageUrl?: string; author?: string; publishedAt?: string;
};

export default async function CategoryPage({ params, searchParams }: any) {
  const category = params.category as string;
  if (!isCategory(category)) return <div className="p-8">Catégorie inconnue</div>;

  const isParis = category === "paris";
  const showRest = isParis && searchParams?.from === "featured";

  if (isParis && !showRest) {
    // … ta section Paris “featured” (highlight + 3 cartes + bouton “Voir tous les articles”)
    // Ce bouton doit pointer vers /categories/paris?from=featured
    return (
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6 capitalize">paris</h1>
        {/* … ton composant ParisFeatured ici … */}
        <div className="mt-6 text-center">
          <Link
            href="/categories/paris?from=featured"
            className="inline-block border border-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition"
          >
            Voir tous les articles
          </Link>
        </div>
      </main>
    );
  }

  // Mode “reste des articles” pour Paris, on démarre à skip=4
  const initialSkip = isParis ? 4 : 0;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 capitalize">{category}</h1>
      <LoadMoreList
        apiBase={API}
        category={category}
        initialSkip={initialSkip}
        pageSize={5}   // <= +5 à chaque clic
      />
    </main>
  );
}