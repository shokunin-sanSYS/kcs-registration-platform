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

  const payload = {
    secret,
    request_id: params.input.request_id,
    form_type: params.input.form_type,
    created_at: new Date().toISOString(),
    candidate_id: params.candidateId,
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