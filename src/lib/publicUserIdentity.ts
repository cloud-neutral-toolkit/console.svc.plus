function normalizeText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRole(value?: string | null): string {
  return normalizeText(value).toLowerCase();
}

export function resolvePublicUserEmail(input: {
  email?: string | null;
  role?: string | null;
}): string {
  const normalizedRole = normalizeRole(input.role);
  if (normalizedRole === "guest") {
    return "";
  }

  return normalizeText(input.email);
}

export function hasPublicUserEmail(input: {
  email?: string | null;
  role?: string | null;
}): boolean {
  if (normalizeRole(input.role) === "guest") {
    return false;
  }

  return normalizeText(input.email).length > 0;
}
