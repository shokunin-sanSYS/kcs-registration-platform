import type { NextApiRequest, NextApiResponse } from "next";

export function requireAdminToken(req: NextApiRequest, res: NextApiResponse): boolean {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected) {
    res.status(500).json({ ok: false, error: "server_misconfigured" });
    return false;
  }

  const provided = req.headers["x-admin-token"];
  const token = Array.isArray(provided) ? provided[0] : provided;

  if (!token || token !== expected) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return false;
  }

  return true;
}