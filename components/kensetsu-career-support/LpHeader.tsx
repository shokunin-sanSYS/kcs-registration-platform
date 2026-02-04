

import Link from "next/link";

type Props = {
  logoHref?: string;
};

export default function LpHeader(props: Props) {
  const logoHref = props.logoHref ?? "/kensetsu-career-support";

  return (
    <>
      <header className="lpTopbar" role="banner">
        <div className="lpTopbarInner brandGrid">
          <div className="brandSlot brandLeft">
            <Link href={logoHref} className="brand" aria-label="建設CAREER SUPPORT トップへ">
              <img
                className="brandMark"
                src="/career-support-logo.png"
                alt="建設CAREER SUPPORT"
                loading="eager"
              />
            </Link>
          </div>

          <div className="topTitle" aria-label="サイト名">
            <div className="topTitleMain">建設業界の求人・転職サイト【業界最大級】</div>
            <div className="topTitleSub">建設CAREER SUPPORT</div>
          </div>

          <div className="brandSlot brandRight" aria-hidden="true" />
        </div>
      </header>

      <style jsx>{`
        .lpTopbar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 12px;
          background: #2175cf;
          color: #fff;
        }

        .lpTopbarInner {
          width: min(1100px, 100%);
        }

        .brandGrid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .brandSlot {
          display: flex;
          align-items: center;
          min-height: 44px;
          min-width: 0;
        }

        .brandLeft {
          justify-content: flex-start;
        }

        .brandRight {
          justify-content: flex-end;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          min-width: 0;
          text-decoration: none;
        }

        .brandMark {
          height: 46px;
          width: auto;
          display: block;
        }

        .topTitle {
          display: grid;
          gap: 2px;
          line-height: 1.15;
          text-align: center;
          justify-items: center;
          padding: 0 8px;
        }

        .topTitleMain {
          font-weight: 800;
          letter-spacing: 0.02em;
          font-size: 16px;
          white-space: nowrap;
        }

        .topTitleSub {
          font-weight: 800;
          letter-spacing: 0.03em;
          font-size: 16px;
        }

        @media (max-width: 420px) {
          .brandGrid {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
            justify-items: center;
            gap: 6px;
          }

          .brandSlot {
            justify-content: center;
          }

          .brandLeft {
            order: 1;
          }

          .topTitle {
            order: 2;
          }

          .brandRight {
            display: none;
          }

          .brandMark {
            height: 30px;
          }

          .topTitleMain {
            font-size: 12px;
            white-space: normal;
            line-height: 1.25;
          }

          .topTitleSub {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}