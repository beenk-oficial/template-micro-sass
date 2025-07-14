import { NextIntlClientProvider } from "next-intl";
import type { AppProps } from "next/app";
import { getLocale, getMessages } from "@/lib/i18n";
import "@/styles/globals.css";
import "@/styles/spinner.css";
import { useWhitelabel } from "@/hooks/useWhitelabel";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/custom/Spinner";
import { useRouter } from "next/router";
import { useWhitelabelStore } from "@/stores/whitelabel";
import { getCookieValue, normalizeLink, setCookie } from "@/utils";
import { useUserStore } from "@/stores/user";
import { useFetch } from "@/hooks/useFetch";
import { User, UserType } from "@/types";

export default function App({ Component, pageProps }: AppProps) {
  const { loadWhitelabel } = useWhitelabel();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const setSlug = useWhitelabelStore((state) => state.setSlug);
  const setDomain = useWhitelabelStore((state) => state.setDomain);
  const setUser = useUserStore((state) => state.setUser);
  const customFetch = useFetch();

  useEffect(() => {
    setSlug((router.query?.slug as string) || "");
    setDomain(window.location.hostname);

    loadWhitelabel({
      slug: router.query?.slug as string,
      domain: window.location.hostname,
    }).then(() => setLoading(false));

    const refreshToken = getCookieValue("refreshToken");

    console.log("Refresh Token:", refreshToken);

    if (refreshToken) {
      customFetch("/api/auth/refresh", {
        method: "POST",
        body: { refreshToken },
      }).then(async (response) => {
        if (response.ok) {
          const {
            user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          } = await response.json();

          setCookie("accessToken", newAccessToken, 3600);
          setCookie("refreshToken", newRefreshToken, 604800);

          setUser(user as User);
          redirectUserByType(user.type);
        }
      });
    }
  }, []);

  const redirectUserByType = (userType: UserType) => {
    if (userType === UserType.ADMIN) {
      router.push(normalizeLink("/admin/dashboard", router));
    } else if (userType === UserType.USER) {
      router.push(normalizeLink("/app/dashboard", router));
    } else if (userType === UserType.OWNER) {
      router.push("/owner/dashboard");
    }
  };

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
