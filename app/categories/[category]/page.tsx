// app/categories/[category]/page.tsx
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

// ✅ Types explicites (searchParams est une Promise en Next 15)
type PageProps = {
  params: { category: string };
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const category = params.category;
  if (!isCategory(category)) return <div className="p-8">Catégorie inconnue</div>;

  // ⬇️ Attendre la promesse
  const q = await searchParams;

  // Cas particulier : /categories/paris (la page /paris gère le "featured")
  const isParis = category === "paris";
  const showRest = isParis && q?.from === "featured";

  if (isParis && !showRest) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6 capitalize">Paris</h1>
        <p className="opacity-70 mb-6">Balades, quartiers, adresses et atmosphères.</p>
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

  // 🔹 Cas général : liste d’une catégorie
  const limit = Number(q?.limit) || 12;
  const page = Number(q?.page) || 1;
  const skip = (page - 1) * limit;

  // Pré-charge (facultatif) pour afficher un message si vide
  const { items } = await fetchJSON<{ items: Article[]; total: number }>(
    `${API}/api/articles?category=${category}&status=published&limit=${limit}&skip=${skip}`
  );

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 capitalize">{category}</h1>

      {!items.length ? (
        <p className="opacity-60">Aucun article disponible pour cette catégorie.</p>
      ) : (
        <LoadMoreList
          apiBase={API}
          category={category}
          initialSkip={skip}
          pageSize={5}   // +5 par clic
        />
      )}
    </main>
  );
}