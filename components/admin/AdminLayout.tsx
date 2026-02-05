import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  title?: string;
  children: React.ReactNode;
};

const NAV_ITEMS: Array<{ href: string; label: string }> = [
  { href: "/admin/candidates", label: "候補者一覧" },
  { href: "/admin/users", label: "ユーザー管理" },
];

export default function AdminLayout(props: Props) {
  const { title = "Admin | KCS", children } = props;
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="page">
        <aside className="sidebar" aria-label="Admin sidebar">
          <div className="sidebarTop">
            <Link href="/admin" className="brand" aria-label="Admin トップへ">
              <span className="brandMark" aria-hidden="true" />
              <span className="brandText">KCS Admin</span>
            </Link>
          </div>

          <nav className="menu" aria-label="Admin navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={"menuItem " + (isActive ? "active" : "")}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="menuItemLabel">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebarBottom">
            <div className="hint">社内専用 / 取り扱い注意</div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div className="topbarInner">
              <div className="pageTitle">{title}</div>
              <Link href="/" className="homeLink">
                LPへ
              </Link>
            </div>
          </header>

          <main className="content">
            <div className="contentInner">{children}</div>
          </main>
        </div>
      </div>

      <style jsx>{`
        :global(html, body) {
          height: 100%;
        }

        :global(body) {
          margin: 0;
          background: #f5f7fb;
          color: #0f172a;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 280px 1fr;
          background: #f5f7fb;
        }

        .sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          background:
            radial-gradient(1200px 800px at 10% 0%, rgba(59, 130, 246, 0.22), transparent 58%),
            radial-gradient(900px 600px at 30% 100%, rgba(96, 165, 250, 0.14), transparent 62%),
            #111c3a;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          padding: 16px 14px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }

        .sidebarTop {
          padding: 6px 6px 12px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          text-decoration: none;
          font-weight: 800;
          letter-spacing: 0.01em;
        }

        .brandMark {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #60a5fa);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
        }

        .brandText {
          font-size: 14px;
          opacity: 0.95;
          white-space: nowrap;
        }

        .menu {
          display: grid;
          gap: 8px;
          margin-top: 10px;
          padding: 0 6px;
        }

        .menuItem {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 12px;
          border-radius: 12px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: transform 0.12s ease, background 0.12s ease, border-color 0.12s ease;
        }

        .menuItem:hover {
          background: rgba(255, 255, 255, 0.14);
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-1px);
        }

        .menuItem.active {
          background: rgba(37, 99, 235, 0.28);
          border-color: rgba(96, 165, 250, 0.38);
          color: #ffffff;
        }

        .menuItem.active::before {
          content: "";
          position: absolute;
          left: -6px;
          top: 10px;
          bottom: 10px;
          width: 4px;
          border-radius: 999px;
          background: linear-gradient(180deg, #60a5fa, #2563eb);
          box-shadow: 0 10px 18px rgba(37, 99, 235, 0.28);
        }

        .menuItemLabel {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebarBottom {
          margin-top: auto;
          padding: 12px 6px 4px;
          opacity: 0.9;
        }

        .hint {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.72);
        }

        .main {
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: #f5f7fb;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 30;
          background: rgba(255, 255, 255, 0.88);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(10px);
        }

        .topbarInner {
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          gap: 12px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .pageTitle {
          font-weight: 900;
          font-size: 14px;
          color: #0f172a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .homeLink {
          font-size: 13px;
          color: #2563eb;
          text-decoration: none;
          padding: 8px 10px;
          border-radius: 10px;
          background: rgba(37, 99, 235, 0.1);
          border: 1px solid rgba(37, 99, 235, 0.18);
          white-space: nowrap;
          transition: background 0.12s ease, transform 0.12s ease;
        }

        .homeLink:hover {
          background: rgba(37, 99, 235, 0.14);
          transform: translateY(-1px);
        }

        .content {
          flex: 1;
          padding: 18px 18px 28px;
          display: flex;
          justify-content: center;
        }

        .contentInner {
          width: min(1160px, 100%);
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 16px;
          box-shadow: 0 18px 50px rgba(2, 6, 23, 0.08);
          padding: 18px;
          min-width: 0;
        }

        @media (max-width: 980px) {
          .page {
            grid-template-columns: 1fr;
          }

          .sidebar {
            height: auto;
            position: sticky;
            z-index: 40;
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          .menu {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .menu {
            grid-template-columns: 1fr;
          }

          .topbarInner {
            padding: 0 14px;
          }

          .content {
            padding: 14px;
          }

          .contentInner {
            padding: 14px;
          }
        }
      `}</style>
    </>
  );
}
