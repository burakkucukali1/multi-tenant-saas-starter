import { getTranslations } from "next-intl/server";

type PlatformAdminPageProps = PageProps<"/[locale]/admin">;

export default async function PlatformAdminPage({
  params,
}: PlatformAdminPageProps) {
  const { locale } = await params;
  const t = await getTranslations("platform.admin");

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-neutral-600">{t("surfaceLabel", { locale })}</p>
    </main>
  );
}
