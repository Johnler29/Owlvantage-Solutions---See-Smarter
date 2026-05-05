const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export function apiUrl(path) {
  if (!path.startsWith("/")) {
    throw new Error(`apiUrl expects a leading slash path. Received: ${path}`);
  }

  if (!API_BASE) {
    return path;
  }

  return `${API_BASE}${path}`;
}
