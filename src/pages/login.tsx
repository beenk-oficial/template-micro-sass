import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { GoogleLogo } from "phosphor-react";
import { useUserStore } from "@/stores/user";
import AuthLayout from "@/components/layout/AuthLayout";
import { CompanyUser, UserType } from "@/types";
import { useSession } from "@/hooks/useSession";
import CustomLink from "@/components/custom/CustomLink";
import { normalizeLink } from "@/utils";
import CustomInput from "@/components/custom/Input/CustomInput";

//@TODO: Set cookie of authentication access to recover session
// and redirect to the correct page based on user type.
//@TODO: Add validation for fields and error handling to forms.
//@TODO: Fix layout of buttons;
//@TODO: Show errors messges when login fails. blocked user, inactive user, etc.
//@TODO: color of inputs more light, and more contrast with the background.
//@TODO: Remove table "company_users" to use only "user" adn join them;
//@TODO: Create components to reuse in the other pages.
//@TODO: Create migrations to create the database structure and tables.

const manageCookie = (
  key: string,
  value: string | null,
  days: number | null
) => {
  if (value && days) {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/`;
  } else {
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  }
};

const handleCheckboxChange = (
  checked: CheckboxPrimitive.CheckedState,
  setState: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (typeof checked === "boolean") {
    setState(checked);
  }
};

const getCookieValue = (key: string): string | null => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${key}=`));
  return cookie ? cookie.split("=")[1] : null;
};

export default function Login() {
  const router = useRouter();
  const t = useTranslations("login") || ((key: string) => key);
  const { companyId } = useSession();

  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = getCookieValue("user_email");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleGoogleLogin = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email`;

    window.location.href = googleAuthUrl;
  };

  const redirectUserByType = (userType: string) => {
    if (userType === UserType.ADMIN) {
      router.push(normalizeLink("/admin"));
    } else if (userType === UserType.USER) {
      router.push(normalizeLink("/app"));
    } else if (userType === UserType.OWNER) {
      router.push("/owner");
    }
  };

  const authenticateWithGoogle = async (
    code: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setUser: (user: CompanyUser) => void,
    router: ReturnType<typeof useRouter>
  ) => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, company_id: null }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Google login error:", errorData.error);
        setLoading(false);
        return;
      }

      const { user } = await response.json();
      setUser(user as CompanyUser);
      redirectUserByType(user.type);
    } catch (error) {
      console.error("Unexpected error during Google login:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      authenticateWithGoogle(code, setLoading, setUser, router);
    }
  }, [router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          company_id: companyId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login error:", errorData.error);
        setLoading(false);
        return;
      }

      const { user } = await response.json();

      setUser(user as unknown as CompanyUser);
      manageCookie("user_email", email, rememberMe ? 30 : null);
      redirectUserByType(user.type);
    } catch (error) {
      console.error("Unexpected error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form
        className="flex flex-col gap-6 max-w-md w-full justify-center align-center"
        onSubmit={handleEmailLogin}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("login_title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("login_subtitle")}
          </p>
        </div>
        <div className="grid gap-6">
          <CustomInput
            htmlFor="email"
            label={t("email_label")}
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
            disabled={loading}
            required
          />
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">{t("password_label")}</Label>
              <CustomLink
                href="/request_password_reset"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                {t("forgot_password")}
              </CustomLink>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="flex items-center">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) =>
                handleCheckboxChange(checked, setRememberMe)
              }
              disabled={loading}
            />
            <Label className="ml-2 text-sm">{t("remember_me")}</Label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("login_button") : t("login_button")}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              {t("login_with")}
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <GoogleLogo size={24} weight="bold" />
            {t("continue_with_google")}
          </Button>
        </div>
        <div className="text-center text-sm">
          {t("signup_prompt")}{" "}
          <CustomLink href="/signup" className="underline underline-offset-4">
            {t("signup_link")}
          </CustomLink>
        </div>
      </form>
    </AuthLayout>
  );
}
