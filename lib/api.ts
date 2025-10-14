export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store", next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  return res.json();
}