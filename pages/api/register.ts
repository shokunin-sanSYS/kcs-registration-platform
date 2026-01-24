import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { validateRegisterBody, toDbRow } from "../../lib/validators/register";
import { runPostSaveHooks } from "../../lib/external/postSaveHooks";

type OkResponse = {
  ok: true;
  request_id: string;
  id: string;
};

type ErrResponse = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

function send(res: NextApiResponse, status: number, body: OkResponse | ErrResponse) {
  res.status(status).json(body);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: { code: "method_not_allowed", message: "POST only" } });
  }

  const parsed = validateRegisterBody(req.body);
  if (!parsed.ok) {
    return send(res, 400, {
      ok: false,
      error: {
        code: "invalid_request",
        message: "Validation failed",
        details: parsed.errors,
      },
    });
  }

  const input = parsed.value;
  const dbRow = toDbRow(input);

  try {
    const sb = supabaseAdmin();

    const { data, error } = await sb
      .from("candidates")
      .insert(dbRow)
      .select("id, request_id")
      .single();

    if (error) {
      const anyErr = error as unknown as { code?: string; message?: string; details?: unknown; hint?: unknown };

      if (anyErr.code === "23505") {
        return send(res, 409, {
          ok: false,
          error: {
            code: "duplicate_request_id",
            message: "request_id already exists",
          },
        });
      }

      console.error("[register] supabase error", {
        request_id: input.request_id,
        code: anyErr.code,
        message: anyErr.message,
        details: anyErr.details,
        hint: anyErr.hint,
      });

      return send(res, 500, {
        ok: false,
        error: { code: "db_error", message: "Failed to save data" },
      });
    }

    const id = data.id as string;
    const request_id = data.request_id as string;

    runPostSaveHooks({ input, candidateId: id }).catch((e) => {
      console.error("[register] postSaveHooks failed", { request_id, error: e });
    });

    return send(res, 200, { ok: true, id, request_id });
  } catch (e) {
    console.error("[register] unexpected error", { request_id: input.request_id, error: e });
    return send(res, 500, {
      ok: false,
      error: { code: "internal_error", message: "Unexpected error" },
    });
  }
}