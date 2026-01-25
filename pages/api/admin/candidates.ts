import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { requireAdminToken } from "../../../lib/adminAuth";

type CandidateRow = {
  id?: string;
  request_id: string;
  form_type: "general" | "beginner";
  lp_id: string;

  name: string;
  birth_year: number;
  tel: string;
  email: string;

  positions: string | null;

  qualifications: string | null;
  experience: string | null;

  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;

  referrer: string | null;
  landing_path: string | null;

  created_at?: string;
};

function asString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length > 0 ? s : null;
}

function clampInt(v: unknown, def: number, min: number, max: number): number {
  const s = asString(v);
  if (!s) return def;
  const n = Number(s);
  if (!Number.isFinite(n)) return def;
  const i = Math.trunc(n);
  if (i < min) return min;
  if (i > max) return max;
  return i;
}

function asIsoDate(v: unknown): string | null {
  const s = asString(v);
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireAdminToken(req, res)) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const form_type = asString(req.query.form_type);
  const lp_id = asString(req.query.lp_id);
  const q = asString(req.query.q);

  const fromIso = asIsoDate(req.query.from);
  const toIso = asIsoDate(req.query.to);

  const limit = clampInt(req.query.limit, 50, 1, 100);
  const offset = clampInt(req.query.offset, 0, 0, 100000);

  const client = supabaseAdmin();
  let query = client
    .from("candidates")
    .select(
      "id,request_id,form_type,lp_id,name,birth_year,tel,email,positions,qualifications,experience,utm_source,utm_medium,utm_campaign,utm_content,utm_term,referrer,landing_path,created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (form_type && (form_type === "general" || form_type === "beginner")) {
    query = query.eq("form_type", form_type);
  }

  if (lp_id) {
    query = query.eq("lp_id", lp_id);
  }

  if (fromIso) {
    query = query.gte("created_at", fromIso);
  }

  if (toIso) {
    query = query.lte("created_at", toIso);
  }

  if (q) {
    const escaped = q.replace(/[%_]/g, "\\$&");
    query = query.or(
      `name.ilike.%${escaped}%,tel.ilike.%${escaped}%,email.ilike.%${escaped}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    res.status(500).json({ ok: false, error: "db_error" });
    return;
  }

  res.status(200).json({
    ok: true,
    items: (data ?? []) as CandidateRow[],
    total: typeof count === "number" ? count : null,
    limit,
    offset,
  });
}