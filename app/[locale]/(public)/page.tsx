type PublicHomePageProps = PageProps<"/[locale]">;

export default async function PublicHomePage({ params }: PublicHomePageProps) {
  const { locale } = await params;

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-semibold">Multi-Tenant SaaS Starter</h1>
      <p className="mt-2 text-neutral-600">Public surface · locale: {locale}</p>
    </main>
  );
}
