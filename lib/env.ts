export function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim().length === 0) {
    throw new Error(`Missing env: ${name}`);
  }
  return v;
}

export function getSupabaseAdminConfig(): {
  url: string;
  serviceRoleKey: string;
} {
  const url = mustGetEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = mustGetEnv("SUPABASE_SERVICE_ROLE_KEY");
  return { url, serviceRoleKey };
}