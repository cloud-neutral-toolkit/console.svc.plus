function normalizeText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function resolvePublicUserEmail(input: {
  email?: string | null;
  role?: string | null;
}): string {
  const normalizedRole = normalizeText(input.role).toLowerCase();
  if (normalizedRole === "guest") {
    return "";
  }

  return normalizeText(input.email);
}

export function hasPublicUserEmail(email?: string | null): boolean {
  return normalizeText(email).length > 0;
}
