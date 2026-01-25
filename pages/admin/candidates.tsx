import { useMemo, useState } from "react";

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

  created_at?: string;
};

type ApiResponse =
  | { ok: true; items: CandidateRow[]; total: number | null; limit: number; offset: number }
  | { ok: false; error: string };

function fmtDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function AdminCandidatesPage() {
  const [adminToken, setAdminToken] = useState("");
  const [formType, setFormType] = useState<"" | "general" | "beginner">("");
  const [lpId, setLpId] = useState("");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CandidateRow[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  const canPrev = offset > 0;
  const canNext = useMemo(() => {
    if (total === null) return items.length === limit;
    return offset + limit < total;
  }, [offset, limit, total, items.length]);

  async function fetchList(nextOffset: number) {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      params.set("offset", String(nextOffset));
      if (formType) params.set("form_type", formType);
      if (lpId.trim()) params.set("lp_id", lpId.trim());
      if (q.trim()) params.set("q", q.trim());
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const res = await fetch(`/api/admin/candidates?${params.toString()}`, {
        method: "GET",
        headers: {
          "x-admin-token": adminToken,
        },
      });

      const json = (await res.json()) as ApiResponse;

      if (!res.ok || !json.ok) {
        setItems([]);
        setTotal(null);
        setError(json.ok ? "unknown_error" : json.error);
        return;
      }

      setItems(json.items);
      setTotal(json.total);
      setOffset(json.offset);
    } catch {
      setError("network_error");
    } finally {
      setLoading(false);
    }
  }

  function onSearch() {
    setOffset(0);
    void fetchList(0);
  }

  function onPrev() {
    const nextOffset = Math.max(0, offset - limit);
    void fetchList(nextOffset);
  }

  function onNext() {
    const nextOffset = offset + limit;
    void fetchList(nextOffset);
  }

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <h1>Admin Candidates</h1>

      <div style={{ display: "grid", gap: 8, maxWidth: 900 }}>
        <label>
          Admin Token（x-admin-token）
          <input
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="ADMIN_API_TOKEN"
            style={{ width: "100%" }}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 1fr", gap: 8 }}>
          <label>
            form_type
            <select value={formType} onChange={(e) => setFormType(e.target.value as any)} style={{ width: "100%" }}>
              <option value="">(all)</option>
              <option value="general">general</option>
              <option value="beginner">beginner</option>
            </select>
          </label>

          <label>
            lp_id
            <input value={lpId} onChange={(e) => setLpId(e.target.value)} style={{ width: "100%" }} />
          </label>

          <label>
            q（name/tel/email）
            <input value={q} onChange={(e) => setQ(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px 120px 120px", gap: 8 }}>
          <label>
            from（ISO/日付文字列）
            <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="2026-01-01" style={{ width: "100%" }} />
          </label>
          <label>
            to（ISO/日付文字列）
            <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="2026-01-31" style={{ width: "100%" }} />
          </label>

          <label>
            limit
            <input
              value={String(limit)}
              onChange={(e) => setLimit(Math.max(1, Math.min(100, Number(e.target.value) || 50)))}
              style={{ width: "100%" }}
            />
          </label>

          <button onClick={onSearch} disabled={loading || !adminToken.trim()} style={{ height: 38 }}>
            {loading ? "Loading..." : "Search"}
          </button>

          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
            <button onClick={onPrev} disabled={loading || !canPrev}>Prev</button>
            <button onClick={onNext} disabled={loading || !canNext}>Next</button>
          </div>
        </div>

        <div style={{ color: "#666" }}>
          total: {total === null ? "(unknown)" : total} / offset: {offset} / limit: {limit}
        </div>

        {error && <div style={{ color: "crimson" }}>error: {error}</div>}
      </div>

      <div style={{ marginTop: 16, overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 900 }}>
          <thead>
            <tr>
              {["created_at", "form_type", "lp_id", "name", "birth_year", "tel", "email", "positions", "qualifications", "experience", "request_id"].map((h) => (
                <th key={h} style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8, whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id ?? r.request_id}>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8, whiteSpace: "nowrap" }}>{fmtDate(r.created_at)}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.form_type}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.lp_id}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.name}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.birth_year}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8, whiteSpace: "nowrap" }}>{r.tel}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.email}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.positions ?? ""}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.qualifications ?? ""}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8 }}>{r.experience ?? ""}</td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: 8, whiteSpace: "nowrap" }}>{r.request_id}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={11} style={{ padding: 12, color: "#666" }}>
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}