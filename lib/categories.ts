export const CATEGORIES = [
  "fashion","art","bars","expos","music","paris","restos","shopping",
] as const;

export type Category = typeof CATEGORIES[number];

export function isCategory(v: string): v is Category {
  return CATEGORIES.includes(v as Category);
}