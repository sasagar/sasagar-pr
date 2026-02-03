import "../styles.css";

import type { ReactNode } from "react";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <title>PR List - sasagar</title>
      <meta name="description" content="sasagar's GitHub Pull Requests collection" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href="https://sasagar-pr.kent-and-co.com/" />
      <meta name="author" content="sasagar" />

      {/* Open Graph */}
      <meta property="og:title" content="PR List - sasagar" />
      <meta property="og:description" content="sasagar's GitHub Pull Requests collection" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://sasagar-pr.kent-and-co.com/" />
      <meta property="og:image" content="https://sasagar-pr.kent-and-co.com/ogp.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content="sasagar PR Portfolio" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="PR List - sasagar" />
      <meta name="twitter:description" content="sasagar's GitHub Pull Requests collection" />
      <meta name="twitter:image" content="https://sasagar-pr.kent-and-co.com/ogp.png" />

      {children}
    </>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
