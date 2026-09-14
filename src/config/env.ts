const stripTrailingSlash = (url: string | undefined): string =>
  (url ?? "").replace(/\/+$/, "");

export const API_BASE_URL = stripTrailingSlash(process.env.EXPO_PUBLIC_API_URL);
export const CHATBOT_BASE_URL = stripTrailingSlash(process.env.EXPO_PUBLIC_CHATBOT_URL);

export function absoluteUrl(path: string): string {
  if (!path || !API_BASE_URL) return path;
  if (path.startsWith("//")) return `https:${path}`;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}/${path}`;
}
