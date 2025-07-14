import { useWhitelabelStore } from "@/stores/whitelabel";
import { NextRouter } from "next/router";

export const normalizeSlug = (slug: string): string => {
  return slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export function normalizeLink(
  link: string,
  router: NextRouter | null = null
): string {
  const slug = router?.query?.slug;
  return slug ? `/${slug}${link}` : link;
}

export function getCookieValue(key: string): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${key}=`));
  console.log("Cookie Value:", document.cookie);
  return cookie ? cookie.split("=")[1] : null;
}

export function setCookie(key: string, value: string, maxAge: number) {
  document.cookie = `${key}=${value}; Path=/; Max-Age=${maxAge}; `;
}
