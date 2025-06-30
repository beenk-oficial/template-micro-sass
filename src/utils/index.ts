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
  const slug =
    useWhitelabelStore((state) => state.company?.slug) ?? router?.query?.slug;
  return slug ? `/${slug}${link}` : link;
}
