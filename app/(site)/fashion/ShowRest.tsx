"use client";

import { useState } from "react";
import LoadMoreList from "@/components/LoadMoreList";
import Link from "next/link";
import s from "./fashion.module.scss";

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

  // Liste à partir du 5e (skip=4), +5 par clic, avec les mêmes styles de cartes
  return (
    <div className="mt-8">
      <LoadMoreList
        apiBase={apiBase}
        category="fashion"
        initialSkip={4}
        pageSize={5}
        listClassName={s.grid}
        renderItem={(a) => (
          <li key={a._id} className={s.card}>
            <Link href={`/categories/fashion/${a.slug}`} className="block">
              {a.imageUrl && <img className={s.card__image} src={a.imageUrl} alt="" />}
              <div className={s.card__body}>
                <h3 className={s.card__title}>{a.title}</h3>
                {a.excerpt && <p className={s.card__excerpt}>{a.excerpt}</p>}
              </div>
            </Link>
          </li>
        )}
      />
    </div>
  );
}