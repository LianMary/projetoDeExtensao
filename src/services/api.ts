export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const baseURL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${baseURL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  return response;
}
