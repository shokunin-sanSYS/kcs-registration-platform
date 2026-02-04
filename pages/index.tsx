import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // ルート直アクセスは建設CAREER SUPPORTの一般LPへ寄せる
    router.replace("/kensetsu-career-support");
  }, [router]);

  return (
    <>
      <Head>
        <title>建設CAREER SUPPORT</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial" }}>
          読み込み中…
        </div>
      </div>
    </>
  );
}
