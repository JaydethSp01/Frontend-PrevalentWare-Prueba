import type { NextApiRequest, NextApiResponse } from "next";

/**
 * BFF: Next.js API routes para comunicación con el backend.
 * Hace proxy de las peticiones al backend (movements, users, reports)
 * reenviando método, headers (incl. cookie), body y query.
 */
function getBackendUrl(): string {
  return (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000"
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const path = req.query.path;
  const pathArray = Array.isArray(path) ? path : path ? [path] : [];

  if (pathArray.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const backendUrl = getBackendUrl();
  const pathSegment = pathArray.join("/");
  const url = new URL(`${backendUrl}/api/${pathSegment}`);

  // Query string
  Object.entries(req.query).forEach(([key, value]) => {
    if (key === "path") return;
    const v = Array.isArray(value) ? value[0] : value;
    if (v !== undefined) url.searchParams.set(key, String(v));
  });

  const headers: HeadersInit = {
    "Content-Type": req.headers["content-type"] ?? "application/json",
  };
  if (req.headers.cookie) {
    headers["Cookie"] = req.headers.cookie;
  }
  if (req.headers.authorization) {
    headers["Authorization"] = req.headers.authorization;
  }

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD" && req.body !== undefined) {
    body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  try {
    const backendRes = await fetch(url.toString(), {
      method: req.method ?? "GET",
      headers,
      body,
    });

    const contentType = backendRes.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await backendRes.json();
      res.status(backendRes.status).json(data);
    } else {
      const text = await backendRes.text();
      res.status(backendRes.status).setHeader("Content-Type", contentType ?? "text/plain");
      res.end(text);
    }
  } catch (err) {
    console.error("[BFF] Proxy error:", err);
    res.status(502).json({ error: "Error de comunicación con el backend" });
  }
}
