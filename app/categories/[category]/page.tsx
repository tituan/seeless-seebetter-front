import { API, fetchJSON } from "@/lib/api";
import { isCategory } from "@/lib/categories";
import LoadMoreList from "@/components/LoadMoreList";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Article = {
  _id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  excerpt?: string;
  author?: string;
  publishedAt?: string;
};

// ✅ Types explicites pour les props Next.js App Router
type PageProps = {
  params: { category: string };
  searchParams: { limit?: string; page?: string; from?: string };
};

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const category = params.category;

  if (!isCategory(category))
    return <div className="p-8">Catégorie inconnue</div>;

  const isParis = category === "paris";
  const showRest = isParis && searchParams?.from === "featured";

  if (isParis && !showRest) {
    // 🔹 Cas particulier : la page Paris “featured” (déjà gérée dans /paris/page.tsx)
    return (
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6 capitalize">Paris</h1>
        <p className="opacity-70 mb-6">
          Balades, quartiers, adresses et atmosphères.
        </p>
        <div className="mt-6 text-center">
          <Link
            href="/paris"
            className="inline-block border border-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition"
          >
            Retour à la page Paris
          </Link>
        </div>
      </main>
    );
  }

  // 🔹 Cas général : affichage des articles d'une catégorie
  const limit = Number(searchParams?.limit) || 12;
  const page = Number(searchParams?.page) || 1;
  const skip = (page - 1) * limit;

  const { items } = await fetchJSON<{ items: Article[]; total: number }>(
    `${API}/api/articles?category=${category}&status=published&limit=${limit}&skip=${skip}`
  );

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 capitalize">{category}</h1>

      {!items.length ? (
        <p className="opacity-60">Aucun article disponible pour cette catégorie.</p>
      ) : (
        <>
          <LoadMoreList
            apiBase={API}
            category={category}
            initialSkip={skip}
            pageSize={5}
          />
        </>
      )}
    </main>
  );
}