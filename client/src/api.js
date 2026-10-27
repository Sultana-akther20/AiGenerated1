const API = import.meta.env.VITE_API_URL || "";

export async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include", // sends the session cookie
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || "Something went wrong");
    err.status = res.status;
    throw err;
  }
  return data;
}
