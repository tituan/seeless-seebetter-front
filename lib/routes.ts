// app/lib/routes.ts
const SECTION_PAGES: Record<string, string> = {
  paris: "/paris",
  fashion: "/fashion",
  art: "/art",
  bars: "/bars",
  expos: "/expos",
  music: "/music",
  restos: "/restos",
  shopping: "/shopping",
  blog: "/blog",
};

export function categoryLandingPath(category: string) {
  const key = (category || "").toLowerCase();
  return SECTION_PAGES[key] ?? `/categories/${key}`;
}