

import Head from "next/head";
import type { ReactNode } from "react";

import LpHeader from "./LpHeader";
import LpFooter from "./LpFooter";

type Props = {
  children: ReactNode;
  title?: string;
  noindex?: boolean;
  heroSrc?: string;
  heroAlt?: string;
};

export default function KcsLayout(props: Props) {
  const {
    children,
    title,
    noindex = true,
    heroSrc,
    heroAlt = "",
  } = props;

  return (
    <>
      <Head>
        {title ? <title>{title}</title> : null}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
      </Head>

      <div className="kcsPage">
        <LpHeader />

        {heroSrc ? (
          <div className="kcsHeroWrap">
            <div className="kcsHeroInner">
              <img className="kcsHeroImg" src={heroSrc} alt={heroAlt} />
            </div>
          </div>
        ) : null}

        <main className="kcsMain" role="main">
          {children}
        </main>

        <LpFooter />
      </div>

      <style jsx>{`
        .kcsPage {
          min-height: 100dvh;
          background: #f6f9fd;
          color: #111;
          display: flex;
          flex-direction: column;
        }

        .kcsHeroWrap {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 16px;
        }

        .kcsHeroInner {
          width: min(960px, 100%);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 28px rgba(2, 6, 23, 0.08);
          background: #fff;
        }

        .kcsHeroImg {
          width: 100%;
          height: auto;
          display: block;
        }

        .kcsMain {
          flex: 1;
        }

        @media (max-width: 420px) {
          .kcsHeroWrap {
            padding: 0;
          }

          .kcsHeroInner {
            border-radius: 0;
          }
        }
      `}</style>
    </>
  );
}