import { NextUIProvider } from "@nextui-org/react";
import "../utils/styles/globals.scss";
import type { AppProps } from "next/app";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layout";
import Head from "next/head";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <Head>
            <title>Best Guilded Bots | Nest</title>
          </Head>
          <Toaster
            richColors
            position="top-center"
            toastOptions={{
              style: {
                background: "#1d1d1d",
                border: "3px solid #2d2d2d",
              },
              classNames: {
                title: "text-white",
              },
            }}
          />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
