import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations("privacy");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <p className="mb-4">{t("introduction")}</p>
      <h2 className="text-2xl font-semibold mb-2">
        {t("data_collection_title")}
      </h2>
      <p className="mb-4">{t("data_collection_description")}</p>
      <h2 className="text-2xl font-semibold mb-2">{t("data_usage_title")}</h2>
      <p className="mb-4">{t("data_usage_description")}</p>
      <h2 className="text-2xl font-semibold mb-2">{t("changes_title")}</h2>
      <p className="mb-4">{t("changes_description")}</p>
    </div>
  );
}
