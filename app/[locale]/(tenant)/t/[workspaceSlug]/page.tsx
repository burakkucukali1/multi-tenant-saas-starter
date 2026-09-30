import { getTranslations } from "next-intl/server";

type TenantWorkspacePageProps = PageProps<"/[locale]/t/[workspaceSlug]">;

export default async function TenantWorkspacePage({
  params,
}: TenantWorkspacePageProps) {
  const { locale, workspaceSlug } = await params;
  const t = await getTranslations("tenant.workspace");

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-neutral-600">
        {t("surfaceLabel", { locale, workspaceSlug })}
      </p>
    </main>
  );
}
