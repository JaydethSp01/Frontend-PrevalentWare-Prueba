import type { User, UserUpdateInput } from "@/core/domain";

/** Siempre usamos el mismo origen en el navegador para que la cookie de sesión se envíe (BFF hace proxy al backend). */
function getBase(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}

const defaultFetchOptions: RequestInit = {
  credentials: "include",
};

function mapUser(u: { id: string; name?: string | null; email?: string | null; image?: string | null; phone?: string | null; role?: string }): User {
  return {
    id: u.id,
    name: u.name ?? "",
    email: u.email ?? "",
    image: u.image ?? undefined,
    phone: u.phone ?? undefined,
    role: (u.role as User["role"]) ?? "ADMIN",
  };
}

export class UsersRepository {
  async getAll(): Promise<User[]> {
    const res = await fetch(`${getBase()}/api/users`, defaultFetchOptions);
    if (!res.ok) throw new Error("Failed to fetch users");
    const list = await res.json();
    return Array.isArray(list) ? list.map(mapUser) : [];
  }

  async getPage(page: number, pageSize: number): Promise<{
    items: User[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const url = new URL(`${getBase()}/api/users`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    const res = await fetch(url.toString(), defaultFetchOptions);
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();

    if (Array.isArray(data)) {
      const items = data.map(mapUser);
      return {
        items,
        total: items.length,
        page: 1,
        pageSize: items.length || pageSize,
        totalPages: 1,
      };
    }

    return {
      items: Array.isArray(data.items) ? data.items.map(mapUser) : [],
      total: data.total ?? 0,
      page: data.page ?? page,
      pageSize: data.pageSize ?? pageSize,
      totalPages: data.totalPages ?? 1,
    };
  }

  async getById(id: string): Promise<User> {
    const res = await fetch(`${getBase()}/api/users/${id}`, defaultFetchOptions);
    if (!res.ok) throw new Error("Failed to fetch user");
    const u = await res.json();
    return mapUser(u);
  }

  async update(id: string, data: UserUpdateInput): Promise<User> {
    const res = await fetch(`${getBase()}/api/users/${id}`, {
      ...defaultFetchOptions,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update user");
    const u = await res.json();
    return mapUser(u);
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${getBase()}/api/users/${id}`, {
      ...defaultFetchOptions,
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete user");
  }
}

export const usersRepository = new UsersRepository();
