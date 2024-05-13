import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const title = "Best Guilded Bots | Nest";
  const description = "Explore millions of Guilded bots.";
  const url = process.env.URL || "https://nestbots.vercel.app";
  const logo = url + "/images/logo.png";
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      
        <meta property="twitter:image" content={logo} />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="description" content={description} />
        <meta property="og:image" content={logo} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta name="theme-color" content="#F5C400" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
