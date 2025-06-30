import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";

export default function PasswordReset() {
  const t = useTranslations("request_password_reset");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/request_password_reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Password reset error:", errorData.error);
        setLoading(false);
        return;
      }

      console.log("Password reset email sent successfully");
    } catch (error) {
      console.error("Unexpected error during password reset:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6 max-w-md w-full justify-center align-center">
        <form onSubmit={handlePasswordReset} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold"> {t("title")}</h1>
            <p className="text-muted-foreground text-sm text-balance">
              {t("subtitle")}
            </p>
          </div>{" "}
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("button_loading") : t("button")}
          </Button>
        </form>
        <div className="text-center text-sm mt-4">
          <Link href="/login" className="underline underline-offset-4">
            {t("back_to_login")}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
