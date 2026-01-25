export type FormType = "general" | "beginner";

export type RegisterInput = {
  request_id: string;
  form_type: FormType;
  lp_id: string;

  name: string;
  birth_year: number;
  tel: string;
  email: string;

  positions: string[];

  qualifications?: string[] | null;
  experience?: string | null;

  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;

  referrer?: string | null;
  landing_path: string;
};

export type ValidationError = {
  field: string;
  message: string;
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length > 0 ? s : null;
}

function asStringArray(v: unknown): string[] | null {
  if (Array.isArray(v)) {
    const arr = v
      .map((x) => (typeof x === "string" ? x.trim() : ""))
      .filter((x) => x.length > 0);
    return arr.length > 0 ? arr : null;
  }
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;
    return s
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);
  }
  return null;
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;
    const n = Number(s);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function isEmailLike(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function normalizeNullableString(v: unknown): string | null {
  const s = asString(v);
  return s ?? null;
}

function normalizeNullableStringArray(v: unknown): string[] | null {
  const a = asStringArray(v);
  return a ?? null;
}

export function validateRegisterBody(
  body: unknown
):
  | { ok: true; value: RegisterInput }
  | { ok: false; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!isPlainObject(body)) {
    return {
      ok: false,
      errors: [{ field: "_", message: "Body must be a JSON object" }],
    };
  }

  const request_id = asString(body.request_id);
  const form_type = asString(body.form_type) as FormType | null;
  const lp_id = asString(body.lp_id);

  const name = asString(body.name);
  const birth_year_raw = asNumber(body.birth_year);
  const tel = asString(body.tel);
  const email = asString(body.email);

  const positions = asStringArray(body.positions);

  const qualifications = normalizeNullableStringArray(body.qualifications);
  const experience = normalizeNullableString(body.experience);

  const utm_source = normalizeNullableString(body.utm_source);
  const utm_medium = normalizeNullableString(body.utm_medium);
  const utm_campaign = normalizeNullableString(body.utm_campaign);
  const utm_content = normalizeNullableString(body.utm_content);
  const utm_term = normalizeNullableString(body.utm_term);

  const referrer = normalizeNullableString(body.referrer);
  const landing_path = asString(body.landing_path);

  if (!request_id) errors.push({ field: "request_id", message: "required" });
  if (!form_type || (form_type !== "general" && form_type !== "beginner")) {
    errors.push({ field: "form_type", message: "must be general or beginner" });
  }
  if (!lp_id) errors.push({ field: "lp_id", message: "required" });

  if (!name) errors.push({ field: "name", message: "required" });
  if (birth_year_raw === null) {
    errors.push({ field: "birth_year", message: "required" });
  }
  if (!tel) errors.push({ field: "tel", message: "required" });
  if (!email) errors.push({ field: "email", message: "required" });
  if (email && !isEmailLike(email)) {
    errors.push({ field: "email", message: "invalid format" });
  }

  if (!positions) errors.push({ field: "positions", message: "required" });
  if (!landing_path) errors.push({ field: "landing_path", message: "required" });

  const birth_year = birth_year_raw ?? 0;
  if (birth_year_raw !== null) {
    if (!Number.isInteger(birth_year) || birth_year < 1900 || birth_year > 2100) {
      errors.push({ field: "birth_year", message: "out of range" });
    }
  }

  if (form_type === "beginner") {
    if (!experience) {
      errors.push({ field: "experience", message: "required for beginner" });
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      request_id: request_id!,
      form_type: form_type!,
      lp_id: lp_id!,
      name: name!,
      birth_year: birth_year,
      tel: tel!,
      email: email!,
      positions: positions!,
      qualifications: qualifications ?? null,
      experience: experience ?? null,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      referrer,
      landing_path: landing_path!,
    },
  };
}

export function toDbRow(input: RegisterInput): Record<string, unknown> {
  const normalized = {
    ...input,
    qualifications: input.form_type === "general" ? input.qualifications ?? null : null,
    experience: input.form_type === "beginner" ? input.experience ?? null : null,
  };

  return {
    request_id: normalized.request_id,
    form_type: normalized.form_type,
    lp_id: normalized.lp_id,

    name: normalized.name,
    birth_year: normalized.birth_year,
    tel: normalized.tel,
    email: normalized.email,

    positions: normalized.positions.join(","),

    qualifications: normalized.qualifications ? normalized.qualifications.join(",") : null,
    experience: normalized.experience ?? null,

    utm_source: normalized.utm_source ?? null,
    utm_medium: normalized.utm_medium ?? null,
    utm_campaign: normalized.utm_campaign ?? null,
    utm_content: normalized.utm_content ?? null,
    utm_term: normalized.utm_term ?? null,

    referrer: normalized.referrer ?? null,
    landing_path: normalized.landing_path,
  };
}