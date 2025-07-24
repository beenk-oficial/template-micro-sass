import type { Metadata } from "next";
import { AppSidebar } from "@/components/custom/AppSidebar";
import { SiteHeader } from "@/components/custom/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  Package,
  Settings,
  Share,
  Shield,
  Tag,
  Users,
} from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useWhitelabel } from "@/hooks/useWhitelabel";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useUserStore } from "@/stores/user";
import { setCookie } from "@/utils";
import { User, UserType } from "@/types";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { whitelabel } = useWhitelabel();
  const { user } = useSession();
  const router = useRouter();
  const t = useTranslations();
  const customFetch = useFetch();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user?.type !== UserType.ADMIN) handleLogout();
  }, [user, router]);

  //@TODO: Finish endpoint to logout user
  // and remove access and refresh tokens from cookies.
  function handleLogout() {
    customFetch("/api/auth/logout", {
      method: "POST",
    }).then(() => {
      setUser(null as unknown as User);
      setCookie("accessToken", "", 3600);
      setCookie("refreshToken", "", 604800);
      router.push("/login");
    });
  }

  const sidebarData = {
    user: {
      name: user?.full_name,
      email: user?.email,
      avatar: user?.avatar_url,
    },
    teams: [
      {
        name: whitelabel?.name,
        logo: () => (
          <img
            src={whitelabel?.favicon}
            alt={`${whitelabel?.name} logo`}
            className="h-6 w-6"
          />
        ),
        plan: whitelabel?.company?.email,
      },
    ],
    navMain: [
      {
        title: t("general.dashboard"),
        url: "/admin/dashboard",
        icon: LayoutDashboard,
        isActive: router.pathname === "/admin/dashboard",
      },
      {
        title: t("general.manage_users"),
        url: "/admin/users",
        icon: Users,
        isActive: router.pathname === "/admin/users",
      },
      {
        title: t("general.plans_and_subscriptions"),
        url: "/admin/subscriptions",
        icon: Package,
        isActive: router.pathname === "/admin/subscriptions",
      },
      {
        title: t("general.payments"),
        url: "/admin/payments",
        icon: CreditCard,
        isActive: router.pathname === "/admin/payments",
      },
      {
        title: t("general.invoices"),
        url: "/admin/invoices",
        icon: FileText,
        isActive: router.pathname === "/admin/invoices",
      },
      {
        title: t("general.promo_codes"),
        url: "/admin/promo_codes",
        icon: Tag,
        isActive: router.pathname === "/admin/promo_codes",
      },
      {
        title: t("general.referrals"),
        url: "/admin/referrals",
        icon: Share,
        isActive: router.pathname === "/admin/referrals",
      },
      {
        title: t("general.access_control"),
        url: "/admin/roles",
        icon: Shield,
        isActive: router.pathname === "/admin/roles",
      },
      {
        title: t("general.settings"),
        icon: Settings,
        isActive: router.pathname.startsWith("/admin/settings"),
        items: [
          {
            title: t("general.company"),
            url: "/admin/settings/company",
          },
          {
            title: t("general.whitelabel"),
            url: "/admin/settings/whitelabel",
          },
          {
            title: t("general.billing"),
            url: "/admin/settings/billing",
          },
        ],
      },
    ],
  };

  const activeItem =
    sidebarData.navMain.find((item) => item.isActive)?.title ||
    t("general.dashboard");

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" data={sidebarData} />
      <SidebarInset>
        <SiteHeader activeTitle={activeItem} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
