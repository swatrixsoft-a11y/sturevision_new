"use client";

/**
 * Wraps fetch with a Clerk Bearer token so API routes work in Clerk v6
 * where cookie-based auth isn't always reliable for client-side fetches.
 */
export async function authedFetch(
  getToken: () => Promise<string | null>,
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getToken();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
