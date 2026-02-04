

import Link from "next/link";

export default function LpFooter() {
  return (
    <footer className="lpFooter" role="contentinfo">
      <div className="lpFooterInner">
        <div className="lpFooterLinks">
          <Link href="/kensetsu-career-support/terms" className="lpFooterLink">
            利用規約
          </Link>
          <Link href="/kensetsu-career-support/privacy" className="lpFooterLink">
            個人情報保護方針
          </Link>
          <a
            href="https://about.shokunin-san.com/about"
            className="lpFooterLink"
            target="_blank"
            rel="noreferrer"
          >
            運営会社
          </a>
        </div>

        <div className="lpFooterCopy">© {new Date().getFullYear()} 職人さんドットコム All rights reserved.</div>
      </div>

      <style jsx>{`
        .lpFooter {
          width: 100%;
          padding: 18px 16px 28px;
          background: #1b4dd6;
        }

        .lpFooterInner {
          width: min(960px, 100%);
          margin: 0 auto;
          display: grid;
          justify-items: center;
          gap: 10px;
          font-size: 12px;
          color: #fff;
        }

        .lpFooterLinks {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .lpFooterCopy {
          font-size: 12px;
          opacity: 0.9;
          text-align: center;
        }

        .lpFooterLink {
          color: #fff;
          text-decoration: underline;
        }

        @media (max-width: 420px) {
          .lpFooterLinks {
            gap: 18px;
          }

          .lpFooterCopy {
            font-size: 11px;
          }
        }
      `}</style>
    </footer>
  );
}