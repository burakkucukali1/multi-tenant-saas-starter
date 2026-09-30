/** Feature-scoped message files under `messages/{locale}/{feature}.json` (ADR-0024). */
export const featureNamespaces = ["public", "tenant", "platform"] as const;

export type FeatureNamespace = (typeof featureNamespaces)[number];

export async function loadFeatureMessages(
  locale: string,
): Promise<Record<FeatureNamespace, Record<string, unknown>>> {
  const entries = await Promise.all(
    featureNamespaces.map(async (feature) => {
      const messagesModule = await import(
        `../../messages/${locale}/${feature}.json`
      );
      return [feature, messagesModule.default] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<
    FeatureNamespace,
    Record<string, unknown>
  >;
}
