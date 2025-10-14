"use client";
import { useState } from "react";
import LoadMoreList from "@/components/LoadMoreList";

export default function ShowRest({ apiBase }: { apiBase: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="text-center">
        <button
          onClick={() => setOpen(true)}
          className="inline-block border border-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition"
        >
          Voir tous les articles
        </button>
      </div>
    );
  }

  // Affiche la liste à partir du 5e (skip=4), +5 par clic
  return <LoadMoreList apiBase={apiBase} category="paris" initialSkip={4} pageSize={5} />;
}