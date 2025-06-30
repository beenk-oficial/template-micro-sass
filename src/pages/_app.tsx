import { NextIntlClientProvider } from "next-intl";
import type { AppProps } from "next/app";
import { getLocale, getMessages } from "@/lib/i18n";
import "@/styles/globals.css";
import { useWhitelabel } from "@/hooks/useWhitelabel";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/custom/Spinner";
import { useRouter } from "next/router";
import { useWhitelabelStore } from "@/stores/whitelabel";

export default function App({ Component, pageProps }: AppProps) {
  const { loadWhitelabel } = useWhitelabel();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const setSlug = useWhitelabelStore((state) => state.setSlug);
  const setDomain = useWhitelabelStore((state) => state.setDomain);

  useEffect(() => {
    setSlug((router.query?.slug as string) || "");
    setDomain(window.location.hostname);

    loadWhitelabel().then(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background/20">
        <Spinner />
      </div>
    );
  }

  return (
    <NextIntlClientProvider locale={getLocale()} messages={getMessages()}>
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}
