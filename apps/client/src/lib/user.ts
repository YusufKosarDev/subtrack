export function getUserInitials(
  name: string | null | undefined,
  email: string
): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const initials = parts
      .slice(0, 2)
      .map((p) => p[0])
      .join("");
    if (initials) return initials.toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}
