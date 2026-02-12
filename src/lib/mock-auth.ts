/**
 * @deprecated No se usa. Auth real vía Better Auth en el backend.
 * Se mantiene este archivo para evitar errores de build/caché que lo referenciaban.
 */

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "ADMIN" | "USER";
}

export interface MockSession {
  user: MockUser;
}

export function getMockSession(): MockSession | null {
  return null;
}

export function setMockSession(_session: MockSession): void {}

export function clearMockSession(): void {}
