import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useWhitelabel } from "@/hooks/useWhitelabel";
import { useTranslations } from "next-intl";
import { GoogleLogo } from "phosphor-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import AuthLayout from "@/components/layout/AuthLayout";

const handleCheckboxChange = (
  checked: CheckboxPrimitive.CheckedState,
  setState: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (typeof checked === "boolean") {
    setState(checked);
  }
};

export default function SignUp() {
  const t = useTranslations("signup");
  const whiteLabel = useWhitelabel();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  const handleGoogleSignup = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email`;

    window.location.href = googleAuthUrl;
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/singup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          full_name: name,
          company_id: null, // @TODO: Replace with actual company ID if needed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup error:", errorData.error);
        setLoading(false);
        return;
      }

      const { user } = await response.json();
      console.log("Signup successful:", user);

      router.push("/login");
    } catch (error) {
      console.error("Unexpected error during signup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout banner={whiteLabel.marketing_banner.signup} invert>
      <form
        className="flex flex-col gap-6 max-w-md w-full justify-center align-center"
        onSubmit={handleEmailSignup}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("signup_title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("signup_subtitle")}
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">{t("name_label")}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t("name_placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">{t("email_label")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="password">{t("password_label")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="confirm-password">
              {t("confirm_password_label")}
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center">
            <Checkbox
              checked={agreeTerms}
              onCheckedChange={(checked) =>
                handleCheckboxChange(checked, setAgreeTerms)
              }
            />
            <Label className="ml-2 text-sm flex flex-wrap gap-1">
              {t("agree_terms_and_conditions")}{" "}
              <Link
                href="/legal/terms"
                className="underline underline-offset-4"
              >
                {t("terms_link")}
              </Link>{" "}
              {t("and")}{" "}
              <Link
                href="/legal/privacy-policy"
                className="underline underline-offset-4"
              >
                {t("privacy_policy_link")}
              </Link>
            </Label>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !agreeTerms}
          >
            {loading ? t("signup_button_loading") : t("signup_button")}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              {t("signup_with")}
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <GoogleLogo size={24} weight="bold" />
            {t("continue_with_google")}
          </Button>
        </div>
        <div className="text-center text-sm">
          {t("login_prompt")}{" "}
          <Link href="/login" className="underline underline-offset-4">
            {t("login_link")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
