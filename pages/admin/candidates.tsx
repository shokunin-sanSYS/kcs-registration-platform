import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

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
    <AdminLayout>
      <div className="page">
        <div className="top">
          <div>
            <h1 className="title">候補者一覧</h1>
            <div className="subtitle">LP登録データの閲覧・検索</div>
          </div>

          <div className="topRight">
            <div className="meta">total: {total === null ? "(unknown)" : total}</div>
            <div className="meta">offset: {offset}</div>
            <div className="meta">limit: {limit}</div>
          </div>
        </div>

        <section className="card">
          <div className="cardHead">
            <div className="cardTitle">検索条件</div>
            <div className="cardActions">
              <button className="btn" onClick={onSearch} disabled={loading || !adminToken.trim()}>
                {loading ? "Loading..." : "Search"}
              </button>
              <button className="btn ghost" onClick={onPrev} disabled={loading || !canPrev}>
                Prev
              </button>
              <button className="btn ghost" onClick={onNext} disabled={loading || !canNext}>
                Next
              </button>
            </div>
          </div>

          <div className="grid">
            <label className="field">
              <span className="label">Admin Token（x-admin-token）</span>
              <input
                className="input"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="ADMIN_API_TOKEN"
              />
              <span className="hint">ブラウザ保存しない前提で、都度貼り付け。</span>
            </label>

            <label className="field">
              <span className="label">form_type</span>
              <select className="input" value={formType} onChange={(e) => setFormType(e.target.value as any)}>
                <option value="">(all)</option>
                <option value="general">general</option>
                <option value="beginner">beginner</option>
              </select>
            </label>

            <label className="field">
              <span className="label">lp_id</span>
              <input className="input" value={lpId} onChange={(e) => setLpId(e.target.value)} placeholder="kcs-general-..." />
            </label>

            <label className="field">
              <span className="label">q（name/tel/email）</span>
              <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="テスト / 090 / example" />
            </label>

            <label className="field">
              <span className="label">from（ISO/日付文字列）</span>
              <input className="input" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="2026-01-01" />
            </label>

            <label className="field">
              <span className="label">to（ISO/日付文字列）</span>
              <input className="input" value={to} onChange={(e) => setTo(e.target.value)} placeholder="2026-01-31" />
            </label>

            <label className="field small">
              <span className="label">limit</span>
              <input
                className="input"
                value={String(limit)}
                onChange={(e) => setLimit(Math.max(1, Math.min(100, Number(e.target.value) || 50)))}
              />
            </label>

            <div className="field small">
              <span className="label">status</span>
              <div className="status">
                {error ? <span className="err">error: {error}</span> : <span className="ok">ready</span>}
              </div>
            </div>
          </div>
        </section>

        <section className="card" style={{ padding: 0 }}>
          <div className="tableWrap" aria-label="候補者一覧テーブル">
            <table className="table">
              <thead>
                <tr>
                  {[
                    "created_at",
                    "form_type",
                    "lp_id",
                    "name",
                    "birth_year",
                    "tel",
                    "email",
                    "positions",
                    "qualifications",
                    "experience",
                    "request_id",
                  ].map((h) => (
                    <th key={h} className="th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id ?? r.request_id} className="tr">
                    <td className="td nowrap">{fmtDate(r.created_at)}</td>
                    <td className="td">{r.form_type}</td>
                    <td className="td">{r.lp_id}</td>
                    <td className="td">{r.name}</td>
                    <td className="td">{r.birth_year}</td>
                    <td className="td nowrap">{r.tel}</td>
                    <td className="td">{r.email}</td>
                    <td className="td">{r.positions ?? ""}</td>
                    <td className="td">{r.qualifications ?? ""}</td>
                    <td className="td">{r.experience ?? ""}</td>
                    <td className="td nowrap">{r.request_id}</td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={11} className="empty">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <style jsx>{`
          .page {
            padding: 4px;
            display: grid;
            gap: 14px;
            color: #0f172a;
            font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          }

          .top {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 12px;
          }

          .title {
            margin: 0;
            font-size: 20px;
            letter-spacing: 0.01em;
          }

          .subtitle {
            margin-top: 6px;
            color: rgba(15, 23, 42, 0.65);
            font-size: 12px;
          }

          .topRight {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-end;
          }

          .meta {
            font-size: 12px;
            color: rgba(15, 23, 42, 0.65);
            padding: 6px 10px;
            border: 1px solid rgba(15, 23, 42, 0.10);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.7);
          }

          .card {
            background: #ffffff;
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 14px;
            box-shadow: 0 10px 24px rgba(2, 6, 23, 0.06);
            padding: 14px;
          }

          .cardHead {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 10px;
          }

          .cardTitle {
            font-weight: 800;
            color: #0f172a;
          }

          .cardActions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .btn {
            appearance: none;
            border: 1px solid rgba(15, 23, 42, 0.14);
            background: #0b2a6f;
            color: #ffffff;
            border-radius: 10px;
            padding: 8px 12px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            transition: transform 0.08s, box-shadow 0.12s, opacity 0.12s;
          }

          .btn:hover {
            box-shadow: 0 10px 18px rgba(2, 6, 23, 0.10);
            transform: translateY(-1px);
          }

          .btn:disabled {
            opacity: 0.55;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .btn.ghost {
            background: #ffffff;
            color: #0b2a6f;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: 10px;
          }

          .field {
            display: grid;
            gap: 6px;
            grid-column: span 4;
            min-width: 0;
          }

          .field.small {
            grid-column: span 2;
          }

          .label {
            font-size: 12px;
            color: rgba(15, 23, 42, 0.75);
            font-weight: 700;
          }

          .hint {
            font-size: 11px;
            color: rgba(15, 23, 42, 0.55);
          }

          .input {
            width: 100%;
            border: 1px solid rgba(15, 23, 42, 0.16);
            border-radius: 10px;
            padding: 9px 10px;
            font-size: 13px;
            background: #ffffff;
            color: #0f172a;
            min-width: 0;
            outline: none;
          }

          .input:focus {
            border-color: rgba(11, 42, 111, 0.55);
            box-shadow: 0 0 0 3px rgba(11, 42, 111, 0.14);
          }

          .status {
            height: 36px;
            display: flex;
            align-items: center;
            padding: 0 10px;
            border-radius: 10px;
            border: 1px solid rgba(15, 23, 42, 0.12);
            background: rgba(15, 23, 42, 0.03);
            font-size: 12px;
          }

          .ok {
            color: rgba(15, 23, 42, 0.70);
            font-weight: 700;
          }

          .err {
            color: #b42318;
            font-weight: 800;
          }

          .tableWrap {
            overflow: auto;
            border-radius: 14px;
          }

          .table {
            border-collapse: separate;
            border-spacing: 0;
            width: 100%;
            min-width: 980px;
          }

          .th {
            position: sticky;
            top: 0;
            background: #ffffff;
            text-align: left;
            font-size: 12px;
            color: rgba(15, 23, 42, 0.70);
            font-weight: 800;
            padding: 10px 12px;
            border-bottom: 1px solid rgba(15, 23, 42, 0.10);
            white-space: nowrap;
          }

          .tr:hover {
            background: rgba(11, 42, 111, 0.03);
          }

          .td {
            padding: 10px 12px;
            border-bottom: 1px solid rgba(15, 23, 42, 0.06);
            font-size: 13px;
            color: #0f172a;
            vertical-align: top;
          }

          .nowrap {
            white-space: nowrap;
          }

          .empty {
            padding: 14px 12px;
            color: rgba(15, 23, 42, 0.60);
            font-size: 13px;
          }

          @media (max-width: 980px) {
            .field {
              grid-column: span 6;
            }

            .field.small {
              grid-column: span 3;
            }
          }

          @media (max-width: 640px) {
            .top {
              align-items: flex-start;
              flex-direction: column;
            }

            .field {
              grid-column: span 12;
            }

            .field.small {
              grid-column: span 6;
            }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
}