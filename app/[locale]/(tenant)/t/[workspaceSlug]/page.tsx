type TenantWorkspacePageProps = PageProps<"/[locale]/t/[workspaceSlug]">;

export default async function TenantWorkspacePage({
  params,
}: TenantWorkspacePageProps) {
  const { locale, workspaceSlug } = await params;

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-semibold">Workspace</h1>
      <p className="mt-2 text-neutral-600">
        Tenant surface · {locale} / {workspaceSlug}
      </p>
    </main>
  );
}
