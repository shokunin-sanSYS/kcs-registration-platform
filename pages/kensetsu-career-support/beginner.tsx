import { useMemo, useState } from "react";
import { useRouter } from "next/router";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string };

function getUtm(routerQuery: Record<string, any>) {
  const pick = (key: string) => {
    const v = routerQuery[key];
    if (typeof v === "string") return v;
    return "";
  };
  return {
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
  };
}

function generateRequestId(prefix: string) {
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${uuid}`;
}

function splitToArrayByCommaOrNewline(text: string): string[] {
  return text
    .split(/[\n,]/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export default function KensetsuCareerSupportBeginnerLp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState<string>("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");

  const [positionsText, setPositionsText] = useState("");
  const [experience, setExperience] = useState<string>(""); // beginner必須
  const [experienceText, setExperienceText] = useState(""); // hidden

  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const landingPath = useMemo(() => {
    const path = router.asPath || "/kensetsu-career-support/beginner";
    return path;
  }, [router.asPath]);

  const utm = useMemo(() => getUtm(router.query as any), [router.query]);

  const validate = () => {
    if (!name.trim()) return "お名前を入力してください";
    if (!birthYear || !/^\d{4}$/.test(birthYear)) return "生年（西暦4桁）を入力してください";
    if (!tel.trim()) return "電話番号を入力してください";
    if (!email.trim()) return "メールアドレスを入力してください";
    const positions = splitToArrayByCommaOrNewline(positionsText);
    if (positions.length === 0) return "希望職種を入力してください";
    if (!experience) return "経験年数を選択してください";
    return "";
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      setSubmitState({ status: "error", message: err });
      return;
    }

    setSubmitState({ status: "submitting" });

    const request_id = generateRequestId("lp-beginner");
    const form_type = "beginner";
    const lp_id = "lp_beginner";

    const positions = splitToArrayByCommaOrNewline(positionsText);

    const payload: Record<string, any> = {
      // hidden（共通必須）
      request_id,
      form_type,
      lp_id,
      landing_path: landingPath,
      referrer: typeof document !== "undefined" ? document.referrer || "" : "",

      // hidden（将来拡張）
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,

      // hidden（未経験のみ）
      experience_text: experienceText || experience,
      positions_text: positionsText,

      // 入力
      name: name.trim(),
      birth_year: Number(birthYear),
      tel: tel.trim(),
      email: email.trim(),
      positions,
      experience: experience, // register側が数値想定なら validators に合わせて変換してください
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 200) {
        router.push("/thanks");
        return;
      }

      const text = await res.text().catch(() => "");
      setSubmitState({
        status: "error",
        message: `送信に失敗しました（HTTP ${res.status}）${text ? `: ${text}` : ""}`,
      });
    } catch (e: any) {
      setSubmitState({
        status: "error",
        message: `通信エラーが発生しました: ${String(e?.message || e)}`,
      });
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1>建設キャリア支援（未経験）</h1>
      <p>必要事項をご入力ください。</p>

      <div style={{ display: "grid", gap: 12 }}>
        <label>
          お名前
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: "block", width: "100%", padding: 8 }}
            placeholder="例：山田 太郎"
          />
        </label>

        <label>
          生年（西暦4桁）
          <input
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            style={{ display: "block", width: "100%", padding: 8 }}
            placeholder="例：1990"
            inputMode="numeric"
          />
        </label>

        <label>
          電話番号
          <input
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            style={{ display: "block", width: "100%", padding: 8 }}
            placeholder="例：09000000000"
            inputMode="tel"
          />
        </label>

        <label>
          メールアドレス
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", width: "100%", padding: 8 }}
            placeholder="例：taro@example.com"
            inputMode="email"
          />
        </label>

        <label>
          希望職種（カンマ区切り or 改行）
          <textarea
            value={positionsText}
            onChange={(e) => setPositionsText(e.target.value)}
            style={{ display: "block", width: "100%", padding: 8, minHeight: 84 }}
            placeholder={"例：現場監督\n施工管理"}
          />
        </label>

        <label>
          経験年数
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            style={{ display: "block", width: "100%", padding: 8 }}
          >
            <option value="">選択してください</option>
            <option value="0">0年</option>
            <option value="1">1年</option>
            <option value="2">2年</option>
            <option value="3">3年</option>
            <option value="4">4年</option>
            <option value="5+">5年以上</option>
          </select>
        </label>

        <label>
          経験の補足（任意）
          <textarea
            value={experienceText}
            onChange={(e) => setExperienceText(e.target.value)}
            style={{ display: "block", width: "100%", padding: 8, minHeight: 72 }}
            placeholder="例：異業種からの転職。現場経験はこれから。"
          />
        </label>

        {submitState.status === "error" ? (
          <div style={{ padding: 12, background: "#fee", border: "1px solid #f99" }}>
            {submitState.message}
          </div>
        ) : null}

        <button
          onClick={onSubmit}
          disabled={submitState.status === "submitting"}
          style={{ padding: 12, fontSize: 16 }}
        >
          {submitState.status === "submitting" ? "送信中..." : "送信する"}
        </button>

        <div style={{ fontSize: 12, opacity: 0.8 }}>
          送信IDは送信直前に自動生成されます。再送する場合は新しいIDになります。
        </div>
      </div>
    </main>
  );
}