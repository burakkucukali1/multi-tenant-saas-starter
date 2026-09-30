/** next-intl wiring (ADR-0024). */
export {
  featureNamespaces,
  loadFeatureMessages,
  type FeatureNamespace,
} from "./load-messages";
export {
  Link,
  getPathname,
  redirect,
  usePathname,
  useRouter,
} from "./navigation";
export { routing, type AppLocale } from "./routing";
