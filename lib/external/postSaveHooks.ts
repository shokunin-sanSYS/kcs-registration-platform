import type { RegisterInput } from "../validators/register";

export async function runPostSaveHooks(params: {
  input: RegisterInput;
  candidateId: string;
}): Promise<void> {
  try {
    await Promise.allSettled([
      notify(params),
      syncToSheet(params),
    ]);
  } catch (e) {
    // Best-effort: never break registration, but keep a breadcrumb for troubleshooting.
    console.error("[postSaveHooks] unexpected error", e);
  }
}

async function notify(params: { input: RegisterInput; candidateId: string }): Promise<void> {
  const url = process.env.KCS_GAS_WEBHOOK_URL;
  const secret = process.env.KCS_WEBHOOK_SECRET;

  // Best-effort: never break registration
  if (!url || !secret) {
    console.warn("[postSaveHooks] webhook env not set", {
      hasUrl: Boolean(url),
      hasSecret: Boolean(secret),
    });
    return;
  }

  const payload: Record<string, unknown> = {
    secret,

    // IDs / metadata
    request_id: params.input.request_id,
    form_type: params.input.form_type,
    created_at: (() => {
      const d = new Date();
      const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${jst.getFullYear()}-${pad(jst.getMonth() + 1)}-${pad(jst.getDate())} ${pad(jst.getHours())}:${pad(jst.getMinutes())}:${pad(jst.getSeconds())}`;
    })(),
    candidate_id: params.candidateId,

    // User input (for notifications)
    name: params.input.name ?? "",
    birth_year: (params.input as any).birth_year ?? "",
    tel: (params.input as any).tel ?? "",
    email: (params.input as any).email ?? "",

    // Step selections (different forms may or may not have these)
    experience: (params.input as any).experience ?? "",
    experience_text: (params.input as any).experience_text ?? "",

    positions: (params.input as any).positions ?? [],
    positions_text: (params.input as any).positions_text ?? "",

    qualifications: (params.input as any).qualifications ?? [],
    qualifications_text: (params.input as any).qualifications_text ?? "",
  };

  try {
    // Apps Script Web App often returns 302; side effects already executed on /exec.
    // Avoid following redirects to googleusercontent which can yield 405.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "manual",
    });

    // Treat 2xx/3xx as success
    if (res.status >= 200 && res.status < 400) {
      return;
    }

    const text = await res.text().catch(() => "");
    console.error("[postSaveHooks] notify failed", {
      status: res.status,
      statusText: res.statusText,
      body: text.slice(0, 500),
    });
  } catch (e) {
    console.error("[postSaveHooks] notify exception", e);
  }
}

async function syncToSheet(_params: { input: RegisterInput; candidateId: string }): Promise<void> {
  return;
}