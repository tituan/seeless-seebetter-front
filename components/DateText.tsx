"use client";

export default function DateText({ iso, prefix = "" }: { iso?: string; prefix?: string }) {
  if (!iso) return null;
  const txt = new Date(iso).toLocaleDateString("fr-FR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });
  return <span>{prefix}{txt}</span>;
}