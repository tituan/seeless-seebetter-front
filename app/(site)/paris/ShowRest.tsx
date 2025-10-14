"use client";
import { useState } from "react";
import LoadMoreList from "@/components/LoadMoreList";
import Link from "next/link";
import s from "./paris.module.scss";

type Props = { apiBase: string };

export default function ShowRest({ apiBase }: Props) {
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

  return (
    <div className="mt-8">
      <LoadMoreList
        apiBase={apiBase}
        category="paris"
        initialSkip={4}           // on a déjà affiché 4 articles au-dessus
        pageSize={5}
        listClassName={s.grid}    // 👈 même grille que tes 3 cartes
        renderItem={(a) => (      // 👈 même rendu que tes cartes
          <li key={a._id} className={s.card}>
            <Link href={`/categories/paris/${a.slug}`} className="block">
              {a.imageUrl && (
                <img className={s.card__image} src={a.imageUrl} alt="" />
              )}
              <div className={s.card__body}>
                <h3 className={s.card__title}>{a.title}</h3>
                {a.excerpt && (
                  <p className={s.card__excerpt}>{a.excerpt}</p>
                )}
              </div>
            </Link>
          </li>
        )}
      />
    </div>
  );
}