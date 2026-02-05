import AdminLayout from "@/components/admin/AdminLayout";

import Head from "next/head";
import Link from "next/link";

export default function AdminHomePage() {
  return (
    <AdminLayout>
      <Head>
        <title>Admin | KCS</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="adminHome">
        <h1 className="title">Admin</h1>
        <p className="desc">社内アプリ（/admin）の入口です。</p>

        <div className="cards">
          <Link href="/admin/candidates" className="card">
            <div className="cardTitle">候補者一覧</div>
            <div className="cardDesc">LP登録データを閲覧・検索</div>
          </Link>

          <Link href="/admin/users" className="card">
            <div className="cardTitle">ユーザー管理</div>
            <div className="cardDesc">profiles と権限の管理（owner用）</div>
          </Link>
        </div>

        <div className="note">
          <div className="noteTitle">次にやること</div>
          <ol>
            <li>/admin/candidates を先に表示できるようにする</li>
            <li>その後 /admin/users を作る（ownerだけアクセス）</li>
          </ol>
        </div>

        <style jsx>{`
          .adminHome {
            display: grid;
            gap: 14px;
          }

          .title {
            margin: 0;
            font-size: 22px;
            letter-spacing: 0.01em;
          }

          .desc {
            margin: -6px 0 0;
            color: #475569;
            font-size: 13px;
          }

          .cards {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin-top: 6px;
          }

          .card {
            display: block;
            padding: 14px;
            border-radius: 12px;
            border: 1px solid rgba(15, 23, 42, 0.12);
            text-decoration: none;
            color: inherit;
            background: #ffffff;
            transition: box-shadow 0.15s, transform 0.15s;
          }

          .card:hover {
            box-shadow: 0 10px 24px rgba(2, 6, 23, 0.08);
            transform: translateY(-1px);
          }

          .cardTitle {
            font-weight: 800;
          }

          .cardDesc {
            margin-top: 6px;
            color: #475569;
            font-size: 13px;
            line-height: 1.6;
          }

          .note {
            margin-top: 6px;
            padding: 12px 14px;
            border-radius: 12px;
            background: #f0f6ff;
            border: 1px solid rgba(27, 77, 214, 0.18);
          }

          .noteTitle {
            font-weight: 800;
            margin-bottom: 8px;
            color: #1e3a8a;
          }

          ol {
            margin: 0;
            padding-left: 18px;
            color: #1f2937;
            font-size: 13px;
            line-height: 1.7;
          }

          @media (max-width: 640px) {
            .cards {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
}