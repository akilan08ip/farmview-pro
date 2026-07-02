import { useEffect, useState } from "react";

export type Role = "admin" | "operator" | "viewer";
const KEY = "farmdrone.role";

const listeners = new Set<(r: Role) => void>();

export function getRole(): Role {
  if (typeof window === "undefined") return "admin";
  return ((localStorage.getItem(KEY) as Role) || "admin");
}

export function setRole(role: Role) {
  localStorage.setItem(KEY, role);
  listeners.forEach((fn) => fn(role));
}

export function useRole(): [Role, (r: Role) => void] {
  const [role, setLocal] = useState<Role>(getRole);
  useEffect(() => {
    const fn = (r: Role) => setLocal(r);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return [role, setRole];
}
