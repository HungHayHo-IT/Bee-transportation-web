/**
 * Backend proxy helpers. The site talks to BeeOps' public APIs (form submit,
 * representative list) — never expose the origin in browser code, always
 * forward via /api/* routes so the origin URL sits only in server env.
 *
 * BEEOPS_API_URL is the full origin + /api prefix, e.g.
 *   https://bee-transportation-admin.vercel.app/api
 * or, in dev pointing at a local instance:
 *   http://localhost:8087/api
 */
import { SERVICE_KEYS, type ServiceKey } from './services';

const RAW = process.env.BEEOPS_API_URL ?? '';
const BEEOPS_API_URL = RAW.replace(/\/+$/, '');

export function isConfigured(): boolean {
  return BEEOPS_API_URL.length > 0;
}

export function backendUrl(path: string): string {
  if (!BEEOPS_API_URL) {
    throw new Error('BEEOPS_API_URL is not configured');
  }
  return `${BEEOPS_API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Every service key the quote form can post, mapped to its backend service
 * CODE (the `services.code` column BeeOps seeds).
 *
 * A key missing here is not a harmless gap: the form still shows the option,
 * but the request reaches the backend without a serviceCode, so no Order is
 * created and the quote sits at `pending` until someone notices. That is what
 * happened while this table held only domestic/customs/project — six of the
 * nine options, the default one included, silently produced no Order.
 *
 * Hence `Record<ServiceKey, string>` rather than `Record<string, string>`:
 * adding a key to SERVICE_KEYS without a code here is a typecheck failure, not
 * a live-site silence. `BRK` (môi giới hàng hải) has no key of its own — the
 * site folds it into the customs option.
 */
const SERVICE_KEY_TO_CODE: Record<ServiceKey, string> = {
  consulting: 'CON',
  domestic: 'DOM',
  multimodal: 'MMT',
  project: 'PRJ',
  lifting: 'LIF',
  packing: 'PKG',
  crossborder: 'CBT',
  leasing: 'RNT',
  customs: 'CUS',
};

function isServiceKey(value: string): value is ServiceKey {
  return (SERVICE_KEYS as readonly string[]).includes(value);
}

export function backendServiceCode(webKey: string | undefined): string | undefined {
  if (!webKey || !isServiceKey(webKey)) return undefined;
  return SERVICE_KEY_TO_CODE[webKey];
}
