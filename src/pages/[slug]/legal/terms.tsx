import { useTranslations } from "next-intl";

export default function Terms() {
  const t = useTranslations("terms");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <p className="mb-4">{t("introduction")}</p>
      <h2 className="text-2xl font-semibold mb-2">{t("usage_title")}</h2>
      <p className="mb-4">{t("usage_description")}</p>
      <h2 className="text-2xl font-semibold mb-2">{t("termination_title")}</h2>
      <p className="mb-4">{t("termination_description")}</p>
      <h2 className="text-2xl font-semibold mb-2">{t("changes_title")}</h2>
      <p className="mb-4">{t("changes_description")}</p>
    </div>
  );
}
