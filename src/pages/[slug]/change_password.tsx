import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useWhitelabel } from "@/hooks/useWhitelabel";
import AuthLayout from "@/components/layout/AuthLayout";

export default function ResetPassword() {
  const t = useTranslations("change_password");
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const whiteLabel = useWhitelabel();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) return;

      try {
        const response = await fetch(`/api/auth/validate_token?token=${token}`);

        if (response.ok) {
          setTokenValid(true);
        } else {
          router.push("/password_reset");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        router.push("/password_reset");
      }
    };

    validateToken();
  }, [token, router]);

  useEffect(() => {
    if (!tokenValid) {
      router.push("/error/403");
    }
  }, [tokenValid, router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Reset password error:", errorData.error);
        setLoading(false);
        return;
      }

      console.log("Password reset successfully");
      router.push("/login");
    } catch (error) {
      console.error("Unexpected error during password reset:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return null;
  }

  return (
    <AuthLayout banner={whiteLabel.marketing_banner.signup} invert>
      <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("subtitle")}
          </p>
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t("button_loading") : t("button")}
        </Button>
      </form>
    </AuthLayout>
  );
}
