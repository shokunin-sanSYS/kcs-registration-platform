

import React from "react";

type StepDotState = "pending" | "current" | "done";

type Props = {
  step: number;
  totalSteps?: number;
  children: React.ReactNode;
  className?: string;
};


export function StepFormShell(props: Props) {
  const { step, totalSteps = 4, children, className } = props;

  // NOTE: some pages may manage steps as 1-based (1..totalSteps).
  // Normalize to 0-based here so the STEP indicator moves correctly.
  const normalizedStep = step >= 1 && step <= totalSteps ? step - 1 : step;
  const safeStep = Math.max(0, Math.min(totalSteps - 1, normalizedStep));

  const stepState = (i: number): StepDotState => {
    if (i < safeStep) return "done";
    if (i === safeStep) return "current";
    return "pending";
  };

  return (
    <div className={"shell " + (className || "")}>
      <div className="formContainer">
        <div className="stickyHeader">
          <nav className="stepper" aria-label="ステップ">
            <span className="stepLabel">STEP</span>
            {Array.from({ length: totalSteps }).map((_, i) => {
              const state = stepState(i);
              const dotClass =
                state === "current"
                  ? "dot current"
                  : state === "done"
                    ? "dot done"
                    : "dot pending";

              return (
                <span
                  key={i}
                  className={dotClass}
                  aria-current={state === "current" ? "step" : "false"}
                >
                  {String(i + 1)}
                </span>
              );
            })}
          </nav>
        </div>

        <div className="body">{children}</div>
      </div>

      <style jsx>{`
        .shell {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .formContainer {
          width: min(960px, 100%);
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 6px 28px rgba(2, 6, 23, 0.08);
          padding: 0;
          overflow: hidden;
          position: relative;
        }

        .stickyHeader {
          position: sticky;
          top: 0;
          background: #ffffff;
          z-index: 10;
          padding: 12px 0;
          border-bottom: 1px solid #eef0f3;
          display: flex;
          justify-content: center;
        }

        .stepper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stepLabel {
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #394150;
        }

        .dot {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .dot.pending {
          background: #e9eef5;
          color: #9aa6b2;
        }

        .dot.current {
          background: #2175cf;
          color: #ffffff;
        }

        .dot.done {
          background: #cfe3ff;
          color: #1b4dd6;
        }

        .body {
          padding: clamp(16px, 2vw + 8px, 28px);
          display: grid;
          gap: 14px;
        }

        @media (max-width: 390px) {
          .formContainer {
            border-radius: 0;
          }

          .stickyHeader {
            padding: 8px 0;
          }

          .body {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default StepFormShell;