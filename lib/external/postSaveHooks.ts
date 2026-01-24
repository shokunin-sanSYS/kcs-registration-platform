import type { RegisterInput } from "../validators/register";

export async function runPostSaveHooks(params: {
  input: RegisterInput;
  candidateId: string;
}): Promise<void> {
  try {
    await Promise.allSettled([notify(params), syncToSheet(params)]);
  } catch (e) {
    console.error("[postSaveHooks] unexpected error", e);
  }
}

async function notify(_params: { input: RegisterInput; candidateId: string }): Promise<void> {
  return;
}

async function syncToSheet(_params: { input: RegisterInput; candidateId: string }): Promise<void> {
  return;
}