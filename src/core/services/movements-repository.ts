import type { Movement, MovementCreateInput } from "@/core/domain";

/** BFF: si no hay URL pública del backend, usamos las Next.js API routes del frontend (proxy). */
const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "";

function getBase(): string {
  if (API_BASE) return API_BASE;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:8000";
}

const defaultFetchOptions: RequestInit = {
  credentials: "include",
};

function mapMovement(m: {
  id: string;
  concept: string;
  amount: number;
  type: string;
  date: string;
  userId: string;
  userName?: string;
  user?: { name?: string | null };
}): Movement {
  return {
    id: m.id,
    concept: m.concept,
    amount: m.amount,
    type: m.type as Movement["type"],
    date: typeof m.date === "string" ? m.date : new Date(m.date).toISOString(),
    userId: m.userId,
    userName: m.userName ?? m.user?.name ?? undefined,
  };
}

export class MovementsRepository {
  async getAll(): Promise<Movement[]> {
    const res = await fetch(`${getBase()}/api/movements`, defaultFetchOptions);
    if (!res.ok) throw new Error("Failed to fetch movements");
    const list = await res.json();
    return Array.isArray(list) ? list.map(mapMovement) : [];
  }

  async getPage(page: number, pageSize: number): Promise<{
    items: Movement[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const url = new URL(`${getBase()}/api/movements`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    const res = await fetch(url.toString(), defaultFetchOptions);
    if (!res.ok) throw new Error("Failed to fetch movements");
    const data = await res.json();

    // Compatibilidad si el backend devuelve un array plano
    if (Array.isArray(data)) {
      const items = data.map(mapMovement);
      return {
        items,
        total: items.length,
        page: 1,
        pageSize: items.length || pageSize,
        totalPages: 1,
      };
    }

    return {
      items: Array.isArray(data.items) ? data.items.map(mapMovement) : [],
      total: data.total ?? 0,
      page: data.page ?? page,
      pageSize: data.pageSize ?? pageSize,
      totalPages: data.totalPages ?? 1,
    };
  }

  async create(data: MovementCreateInput): Promise<Movement> {
    const body = {
      ...data,
      date: typeof data.date === "string" ? data.date : new Date(data.date).toISOString().slice(0, 10),
    };
    const res = await fetch(`${getBase()}/api/movements`, {
      ...defaultFetchOptions,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to create movement");
    const m = await res.json();
    return mapMovement(m);
  }

  async update(id: string, data: Partial<MovementCreateInput>): Promise<Movement> {
    const body: Record<string, unknown> = { ...data };
    if (data.date !== undefined)
      body.date = typeof data.date === "string" ? data.date : new Date(data.date).toISOString().slice(0, 10);
    const res = await fetch(`${getBase()}/api/movements/${id}`, {
      ...defaultFetchOptions,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to update movement");
    const m = await res.json();
    return mapMovement(m);
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${getBase()}/api/movements/${id}`, {
      ...defaultFetchOptions,
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete movement");
  }
}

export const movementsRepository = new MovementsRepository();
