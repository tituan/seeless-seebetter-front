"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ViewAllButton() {
  const [href, setHref] = useState("/categories/paris?from=featured&limit=10");

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 899px)").matches;
    setHref(`/categories/paris?from=featured&limit=${isMobile ? 7 : 10}`);
  }, []);

  return (
    <Link href={href} className="inline-block border border-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition">
      Voir tous les articles
    </Link>
  );
}