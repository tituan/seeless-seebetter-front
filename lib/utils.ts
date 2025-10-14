export const API = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, next: { revalidate: 0 }, cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}