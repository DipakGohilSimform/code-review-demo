import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Capitalises the first letter of a role string. e.g. "admin" → "Admin" */
export function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

/** Returns uppercase initials from a full name. e.g. "Sarah Mitchell" → "SM" */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase();
}
