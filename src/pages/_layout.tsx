import "../styles.css";

import type { ReactNode } from "react";

const SITE_URL = "https://sasagar-pr.kent-and-co.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "sasagar PR Portfolio",
      url: SITE_URL,
      description: "sasagar のオープンソースプロジェクトへのコントリビューション PR 一覧サイト",
      author: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "sasagar",
      url: "https://github.com/sasagar",
      sameAs: ["https://github.com/sasagar", "https://x.com/sasagawaki"],
    },
  ],
};

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <title>sasagar の OSS コントリビューション PR 一覧 | sasagar PR Portfolio</title>
      <meta
        name="description"
        content="sasagar（GitHub: @sasagar）のオープンソースコントリビューション一覧。マージ済み・オープン・クローズド PR をフィルタリングして閲覧できます。"
      />
      <meta name="robots" content="index, follow" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href={`${SITE_URL}/`} />
      <meta name="author" content="sasagar" />

      {/* Open Graph */}
      <meta
        property="og:title"
        content="sasagar の OSS コントリビューション PR 一覧 | sasagar PR Portfolio"
      />
      <meta
        property="og:description"
        content="sasagar（GitHub: @sasagar）のオープンソースコントリビューション一覧。マージ済み・オープン・クローズド PR をフィルタリングして閲覧できます。"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${SITE_URL}/`} />
      <meta property="og:image" content={`${SITE_URL}/ogp.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content="sasagar PR Portfolio" />
      <meta property="og:locale" content="ja_JP" />

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@sasagawaki" />
      <meta
        name="twitter:title"
        content="sasagar の OSS コントリビューション PR 一覧 | sasagar PR Portfolio"
      />
      <meta
        name="twitter:description"
        content="sasagar（GitHub: @sasagar）のオープンソースコントリビューション一覧。マージ済み・オープン・クローズド PR をフィルタリングして閲覧できます。"
      />
      <meta name="twitter:image" content={`${SITE_URL}/ogp.png`} />

      {/* JSON-LD 構造化データ */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is static structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {children}
    </>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
