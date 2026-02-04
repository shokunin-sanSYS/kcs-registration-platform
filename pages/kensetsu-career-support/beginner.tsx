import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import LpHeader from "../../components/kensetsu-career-support/LpHeader";
import LpFooter from "../../components/kensetsu-career-support/LpFooter";
import Hero from "../../components/kensetsu-career-support/Hero";
import StepFormShell from "../../components/kensetsu-career-support/StepFormShell";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string };

type StepIndex = 0 | 1 | 2 | 3;

type ChoiceItem = {
  label: string;
  icon?: string;
};

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

function isEmailLike(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isTelLike(v: string) {
  const cleaned = v.replace(/[^\d]/g, "");
  return /^0\d{9,10}$/.test(cleaned);
}

function yearOptions() {
  const y = new Date().getFullYear();
  const years: number[] = [];
  for (let i = y - 16; i >= y - 80; i -= 1) years.push(i);
  return years;
}

const BRAND = "#2175cf";
const BG = "#f6f9fd";
const TEXT = "#111";
const MUTED = "#667085";
const DANGER = "#d92d20";

const POSITIONS: ChoiceItem[] = [
  {
    label: "わからない・相談して決めたい",
    icon:
      "https://storage.googleapis.com/studio-design-asset-files/projects/xNWY3vy4ql/s-500x500_3b8224d2-7113-4fab-89f6-74fc569a7917.webp",
  },
  {
    label: "施工管理",
    icon:
      "https://storage.googleapis.com/studio-design-asset-files/projects/xNWY3vy4ql/s-500x500_2063ca8c-231e-4f6e-8821-234638a5fcea.webp",
  },
  {
    label: "建築士・設計士",
    icon:
      "https://storage.googleapis.com/studio-design-asset-files/projects/xNWY3vy4ql/s-500x500_c398c0a4-6699-4da3-8c01-e78862065fe5.webp",
  },
];

const EXPERIENCES: ChoiceItem[] = [
  { label: "未経験" },
  { label: "1年未満" },
  { label: "1～5年未満" },
  { label: "5年以上" },
];


function ChoiceButton(props: {
  item: ChoiceItem;
  pressed: boolean;
  onToggle: () => void;
  onMoveFocus?: (dir: -1 | 1) => void;
  group: "positions" | "experience";
  index: number;
}) {
  const { item, pressed } = props;

  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    border: `2px solid ${pressed ? "#1b4dd6" : "#e5e7eb"}`,
    borderRadius: 14,
    padding: "14px 16px",
    background: pressed ? "#f0f6ff" : "#fff",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color .2s, box-shadow .2s, background .2s",
    boxShadow: pressed ? "0 0 0 3px rgba(27,77,214,.15)" : "none",
  };

  const imgStyle: React.CSSProperties = {
    width: 32,
    height: 32,
    objectFit: "contain",
    flex: "0 0 auto",
  };

  return (
    <button
      type="button"
      style={style}
      aria-pressed={pressed}
      data-choice-group={props.group}
      data-choice-index={props.index}
      onClick={props.onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          props.onToggle();
          return;
        }
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          props.onMoveFocus?.(1);
          return;
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          props.onMoveFocus?.(-1);
        }
      }}
    >
      {item.icon ? <img alt="" src={item.icon} style={imgStyle} /> : null}
      <span>{item.label}</span>
    </button>
  );
}

export default function KensetsuCareerSupportBeginnerLp() {
  const router = useRouter();

  const [step, setStep] = useState<StepIndex>(0);

  const [positionsSelected, setPositionsSelected] = useState<string[]>([]);
  const [experienceSelected, setExperienceSelected] = useState<string>("");

  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState<string>("");

  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");

  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const [s1Error, setS1Error] = useState("");
  const [s2Error, setS2Error] = useState("");
  const [nameError, setNameError] = useState("");
  const [yearError, setYearError] = useState("");
  const [telError, setTelError] = useState("");
  const [emailError, setEmailError] = useState("");

  const landingPath = useMemo(() => {
    const path = router.asPath || "/kensetsu-career-support/beginner";
    return path;
  }, [router.asPath]);

  const utm = useMemo(() => getUtm(router.query as any), [router.query]);
  const years = useMemo(() => yearOptions(), []);

  const positions_text = useMemo(() => positionsSelected.join(", "), [positionsSelected]);
  const experience_text = useMemo(() => experienceSelected, [experienceSelected]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setStepSafe = (n: StepIndex) => {
    setSubmitState({ status: "idle" });
    setStep(n);
    scrollTop();
  };

  const validateStep3 = () => {
    let ok = true;

    const vName = name.trim();
    if (!vName) {
      setNameError("お名前を入力してください。");
      ok = false;
    } else {
      setNameError("");
    }

    if (!birthYear) {
      setYearError("生年を選択してください。");
      ok = false;
    } else {
      setYearError("");
    }

    return ok;
  };

  const validateStep4 = () => {
    let ok = true;

    const telVal = tel.trim();
    if (!telVal) {
      setTelError("電話番号を入力してください。");
      ok = false;
    } else if (!isTelLike(telVal)) {
      setTelError("電話番号の形式が正しくありません（0から始まる10〜11桁）。");
      ok = false;
    } else {
      setTelError("");
    }

    const emailVal = email.trim();
    if (!emailVal) {
      setEmailError("メールアドレスを入力してください。");
      ok = false;
    } else if (!isEmailLike(emailVal)) {
      setEmailError("メールアドレスの形式が正しくありません。");
      ok = false;
    } else {
      setEmailError("");
    }

    return ok;
  };

  const onTo2 = () => {
    if (positionsSelected.length > 0) {
      setS1Error("");
      setStepSafe(1);
    } else {
      setS1Error("少なくとも1つ選択してください。");
    }
  };

  const onTo3 = () => {
    if (experienceSelected) {
      setS2Error("");
      setStepSafe(2);
    } else {
      setS2Error("少なくとも1つ選択してください。");
    }
  };

  const onTo4 = () => {
    if (validateStep3()) setStepSafe(3);
    else scrollTop();
  };

  const onSubmit = async () => {
    if (submitState.status === "submitting") return;

    if (!validateStep4()) {
      scrollTop();
      return;
    }

    setSubmitState({ status: "submitting" });

    const request_id = generateRequestId("lp-beginner");
    const form_type = "beginner";
    const lp_id = "lp_beginner";

    const payload: Record<string, any> = {
      request_id,
      form_type,
      lp_id,
      landing_path: landingPath,
      referrer: typeof document !== "undefined" ? document.referrer || "" : "",

      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,

      positions_text,
      experience_text,

      name: name.trim(),
      birth_year: Number(birthYear),
      tel: tel.trim(),
      email: email.trim(),

      positions: positionsSelected,
      experience: experienceSelected,
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

  const wrapperStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: BG,
    color: TEXT,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  };

  // Removed: topBarStyle, brandStyle, brandMarkStyle, containerStyle


  const hintStyle: React.CSSProperties = {
    color: MUTED,
    fontSize: "0.95rem",
    margin: ".25rem 0 1rem",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 8,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: 600,
    margin: "12px 0 6px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    fontSize: "1rem",
    background: "#fff",
  };

  const errorTextStyle: React.CSSProperties = {
    color: DANGER,
    marginTop: 6,
    fontSize: ".9rem",
  };

  const controlsStyle: React.CSSProperties = {
    display: "flex",
    gap: 12,
    marginTop: 12,
    paddingBottom: 16,
  };

  const btnStyle: React.CSSProperties = {
    flex: 1,
    appearance: "none",
    border: 0,
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: "1rem",
    background: "#1b4dd6",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  };

  const btnSecondaryStyle: React.CSSProperties = {
    ...btnStyle,
    background: "#e7eefc",
    color: "#183572",
  };

  const disabledBtnStyle: React.CSSProperties = {
    opacity: 0.65,
    cursor: "not-allowed",
  };


  const togglePositions = (label: string) => {
    setS1Error("");
    setPositionsSelected((prev) => {
      const exists = prev.includes(label);
      if (exists) return prev.filter((x) => x !== label);
      return [...prev, label];
    });
  };

  const setExperienceSingle = (label: string) => {
    setS2Error("");
    setExperienceSelected((prev) => (prev === label ? "" : label));
  };

  const focusMove = (group: "positions" | "experience", currentIndex: number, dir: -1 | 1) => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLButtonElement>(`button[data-choice-group="${group}"]`)
    );
    if (!nodes.length) return;
    const next = Math.max(0, Math.min(nodes.length - 1, currentIndex + dir));
    nodes[next]?.focus();
  };

  return (
    <div style={wrapperStyle}>
      <LpHeader />

      <div className="pagePad">
        <div className="contentWrap">
          <Hero src="/hero-beginner.png" alt="建設キャリア支援（未経験）" priority />

          <StepFormShell step={step} totalSteps={4}>
            <form
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                if (step < 3) {
                  e.preventDefault();
                  if (step === 2) {
                    if (validateStep3()) setStepSafe(3);
                  }
                }
              }}
              onSubmit={(e) => {
                e.preventDefault();
                if (step !== 3) return;
                onSubmit();
              }}
              noValidate
            >
              {step === 0 ? (
                <section aria-labelledby="s1-title">
                  <h2 id="s1-title">ご希望の職種を選択</h2>
                  <p style={hintStyle}>複数選択可。</p>

                  <div style={gridStyle} role="group" aria-label="希望職種" id="positions">
                    {POSITIONS.map((it, idx) => (
                      <ChoiceButton
                        key={it.label}
                        item={it}
                        pressed={positionsSelected.includes(it.label)}
                        onToggle={() => togglePositions(it.label)}
                        onMoveFocus={(dir) => focusMove("positions", idx, dir)}
                        group="positions"
                        index={idx}
                      />
                    ))}
                  </div>

                  {s1Error ? <div style={errorTextStyle}>{s1Error}</div> : null}

                  <div style={controlsStyle}>
                    <button
                      type="button"
                      style={btnStyle}
                      onClick={onTo2}
                      disabled={submitState.status === "submitting"}
                    >
                      次へ
                    </button>
                  </div>
                </section>
              ) : null}

              {step === 1 ? (
                <section aria-labelledby="s2-title">
                  <h2 id="s2-title">建設業界の経験年数</h2>

                  <div style={gridStyle} role="group" aria-label="経験年数" id="experience">
                    {EXPERIENCES.map((it, idx) => (
                      <ChoiceButton
                        key={it.label}
                        item={it}
                        pressed={experienceSelected === it.label}
                        onToggle={() => setExperienceSingle(it.label)}
                        onMoveFocus={(dir) => focusMove("experience", idx, dir)}
                        group="experience"
                        index={idx}
                      />
                    ))}
                  </div>

                  {s2Error ? <div style={errorTextStyle}>{s2Error}</div> : null}

                  <div style={controlsStyle}>
                    <button
                      type="button"
                      style={btnSecondaryStyle}
                      onClick={() => setStepSafe(0)}
                      disabled={submitState.status === "submitting"}
                    >
                      戻る
                    </button>
                    <button
                      type="button"
                      style={btnStyle}
                      onClick={onTo3}
                      disabled={submitState.status === "submitting"}
                    >
                      次へ
                    </button>
                  </div>
                </section>
              ) : null}

              {step === 2 ? (
                <section aria-labelledby="s3-title">
                  <h2 id="s3-title">お名前と生年を入力</h2>

                  <label htmlFor="name" style={labelStyle}>
                    お名前
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="例:山田 太郎"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError("");
                    }}
                    style={{
                      ...inputStyle,
                      ...(nameError
                        ? { borderColor: DANGER, boxShadow: "0 0 0 3px rgba(217,45,32,.1)" }
                        : {}),
                    }}
                  />
                  {nameError ? <div style={errorTextStyle}>{nameError}</div> : null}

                  <label htmlFor="birthyear" style={labelStyle}>
                    生年
                  </label>
                  <select
                    id="birthyear"
                    name="birthyear"
                    required
                    value={birthYear}
                    onChange={(e) => {
                      setBirthYear(e.target.value);
                      setYearError("");
                    }}
                    style={{
                      ...inputStyle,
                      ...(yearError
                        ? { borderColor: DANGER, boxShadow: "0 0 0 3px rgba(217,45,32,.1)" }
                        : {}),
                    }}
                  >
                    <option value="">選択してください</option>
                    {years.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}年
                      </option>
                    ))}
                  </select>
                  {yearError ? <div style={errorTextStyle}>{yearError}</div> : null}

                  <div style={controlsStyle}>
                    <button
                      type="button"
                      style={btnSecondaryStyle}
                      onClick={() => setStepSafe(1)}
                      disabled={submitState.status === "submitting"}
                    >
                      戻る
                    </button>
                    <button
                      type="button"
                      style={btnStyle}
                      onClick={onTo4}
                      disabled={submitState.status === "submitting"}
                    >
                      次へ
                    </button>
                  </div>
                </section>
              ) : null}

              {step === 3 ? (
                <section aria-labelledby="s4-title">
                  <h2 id="s4-title">連絡先を入力</h2>
                  <p style={hintStyle}>担当者よりご連絡させて頂きます</p>

                  <label htmlFor="tel" style={labelStyle}>
                    電話番号(ハイフン不要)
                  </label>
                  <input
                    id="tel"
                    name="tel"
                    type="tel"
                    inputMode="numeric"
                    placeholder="例:09012345678"
                    required
                    value={tel}
                    onChange={(e) => {
                      setTel(e.target.value);
                      setTelError("");
                    }}
                    style={{
                      ...inputStyle,
                      ...(telError
                        ? { borderColor: DANGER, boxShadow: "0 0 0 3px rgba(217,45,32,.1)" }
                        : {}),
                    }}
                  />
                  <div style={hintStyle}>固定:10桁 / 携帯:11桁。0から始まる数字のみ。</div>
                  {telError ? <div style={errorTextStyle}>{telError}</div> : null}

                  <label htmlFor="email" style={labelStyle}>
                    メールアドレス
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    style={{
                      ...inputStyle,
                      ...(emailError
                        ? { borderColor: DANGER, boxShadow: "0 0 0 3px rgba(217,45,32,.1)" }
                        : {}),
                    }}
                  />
                  {emailError ? <div style={errorTextStyle}>{emailError}</div> : null}

                  {submitState.status === "error" ? (
                    <div style={{ ...errorTextStyle, marginTop: 12 }} aria-live="polite">
                      {submitState.message}
                    </div>
                  ) : null}

                  <div style={controlsStyle}>
                    <button
                      type="button"
                      style={btnSecondaryStyle}
                      onClick={() => setStepSafe(2)}
                      disabled={submitState.status === "submitting"}
                    >
                      戻る
                    </button>
                    <button
                      type="submit"
                      style={{
                        ...btnStyle,
                        ...(submitState.status === "submitting" ? disabledBtnStyle : {}),
                      }}
                      disabled={submitState.status === "submitting"}
                    >
                      {submitState.status === "submitting" ? "送信中…" : "送信"}
                    </button>
                  </div>

                  <input type="hidden" name="positions_text" value={positions_text} readOnly />
                  <input type="hidden" name="experience_text" value={experience_text} readOnly />
                </section>
              ) : null}
            </form>
          </StepFormShell>
        </div>
      </div>

      <LpFooter />

      <style jsx>{`
        .pagePad {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 16px;
        }

        .contentWrap {
          width: min(960px, 100%);
          display: grid;
          gap: 0;
        }

        @media (max-width: 420px) {
          .pagePad {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}