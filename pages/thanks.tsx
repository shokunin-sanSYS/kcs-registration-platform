import Head from "next/head";
import LpHeader from "../components/kensetsu-career-support/LpHeader";
import LpFooter from "../components/kensetsu-career-support/LpFooter";

export default function ThanksPage() {
  return (
    <>
      <Head>
        <title>送信完了 | 建設CAREER SUPPORT</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="page">
        <LpHeader />

        <main className="content">
          <div className="contentInner">
            <h1 className="thanksTitle">ご回答ありがとうございました！</h1>
            <p className="thanksText">
              数日以内に担当者よりご連絡させて頂きます。
            </p>
            <p className="thanksSubText">
              まずはご状況やご希望を詳しく伺い、最適な求人をご紹介させていただきます。<br />
              下の予約ページから先に面談日時を決めていただけるとスムーズです！
            </p>

            <a
              href="https://timerex.net/s/info04_74cd/c0b05f23"
              className="reserveButton"
              target="_blank"
              rel="noreferrer"
            >
              ▶ 予約はこちら
            </a>
          </div>
        </main>

        <LpFooter />
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .content {
          flex: 1 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
        }
        .contentInner {
          max-width: 720px;
          width: 100%;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px 0 rgba(0,0,0,0.08);
          padding: 48px 24px;
          margin: 0 auto;
        }
        .thanksTitle {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 24px;
          font-weight: 600;
          color: #1b4dd6;
        }
        .thanksText {
          text-align: center;
          color: #3c4043;
          font-size: 1.1rem;
        }
        .thanksSubText {
          text-align: center;
          color: #5f6b7a;
          font-size: 1rem;
          line-height: 1.7;
          margin-top: 16px;
        }
        .reserveButton {
          display: block;
          width: fit-content;
          margin: 32px auto 0;
          padding: 12px 28px;
          background: #1b4dd6;
          color: #ffffff;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(27, 77, 214, 0.25);
        }
      `}</style>
    </>
  );
}