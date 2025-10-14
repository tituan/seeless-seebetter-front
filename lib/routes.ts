import type { Route } from "next";

// Liste des sections avec leur landing page
const SECTION_PAGES = {
  paris: "/paris",
  fashion: "/fashion",
  art: "/art",
  bars: "/bars",
  expos: "/expos",
  music: "/music",
  restos: "/restos",
  shopping: "/shopping",
  blog: "/blog",
} as const;

type SectionKey = keyof typeof SECTION_PAGES;

/**
 * Retourne la landing page d'une catégorie
 * (ex: "fashion" → "/fashion", "paris" → "/paris")
 */
export function categoryLandingPath(category: string): Route {
  const key = (category || "").toLowerCase() as SectionKey;
  if (key in SECTION_PAGES) {
    return SECTION_PAGES[key] as Route;
  }
  return (`/categories/${key}`) as Route; // fallback typé
}