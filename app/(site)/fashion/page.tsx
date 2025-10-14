import Container from "@/components/Container";
import Link from "next/link";
import { API, fetchJSON } from "@/lib/api";
import s from "./fashion.module.scss";
import ShowRest from "./ShowRest";

export const dynamic = "force-dynamic";

type Article = {
  _id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  excerpt?: string;
  publishedAt?: string;
  author?: string;
};

export default async function FashionPage() {
  const { items, total } = await fetchJSON<{ items: Article[]; total: number }>(
    `${API}/api/articles?category=fashion&status=published&limit=4&skip=0`
  );

  return (
    <Container>
      <header className={s.header}>
        <h1 className={s.header__title}>Fashion</h1>
        <p className={s.header__intro}>
          Sélections, silhouettes, matières et inspirations.
        </p>
      </header>

      {!items.length ? (
        <p>Aucun article disponible pour le moment.</p>
      ) : (
        <>
          {(() => {
            const [a, ...rest] = items;
            const hasImage = Boolean(a.imageUrl);

            return (
              <>
                {/* HERO */}
                <article className={`${s.hero} ${!hasImage ? s.heroMobile : ""}`}>
                  <Link href={`/categories/fashion/${a.slug}`}>
                    {hasImage && (
                      <img className={s.hero__image} src={a.imageUrl!} alt="" />
                    )}
                    <div className={s.hero__body}>
                      <h2 className={s.hero__title}>{a.title}</h2>
                      {a.excerpt && (
                        <p className={s.hero__excerpt}>{a.excerpt}</p>
                      )}
                      <div className={s.hero__meta}>
                        {(a.author ?? "SLSB") +
                          (a.publishedAt
                            ? " — " +
                              new Date(a.publishedAt).toLocaleDateString("fr-FR")
                            : "")}
                      </div>
                    </div>
                  </Link>
                </article>

                {/* 3 petites cartes */}
                {rest.length > 0 && (
                  <ul className={s.grid}>
                    {rest.map((it) => (
                      <li key={it._id} className={s.card}>
                        <Link href={`/categories/fashion/${it.slug}`} className="block">
                          {it.imageUrl && (
                            <img className={s.card__image} src={it.imageUrl} alt="" />
                          )}
                          <div className={s.card__body}>
                            <h3 className={s.card__title}>{it.title}</h3>
                            {it.excerpt && (
                              <p className={s.card__excerpt}>{it.excerpt}</p>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            );
          })()}

          {/* Voir le reste, inline */}
          {total > 4 && (
            <div className={s.ctaWrap}>
              <ShowRest apiBase={API} />
            </div>
          )}
        </>
      )}
    </Container>
  );
}