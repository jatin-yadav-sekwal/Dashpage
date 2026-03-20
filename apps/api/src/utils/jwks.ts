import { decode } from "hono/jwt";

// ─────────────────────────────────────────────────────────────
// JWKS Key Cache
// ─────────────────────────────────────────────────────────────
// Cache keys in memory: kid → CryptoKey
// Valid for the lifetime of the serverless isolate.
// Warm requests benefit from cached keys; cold starts re-fetch.
// ─────────────────────────────────────────────────────────────

const keyCache: Record<string, CryptoKey> = {};

/** Timeout for JWKS fetch in milliseconds */
const JWKS_FETCH_TIMEOUT_MS = 5_000;

export function getJwksUrl() {
  if (process.env.SUPABASE_JWKS_URL) return process.env.SUPABASE_JWKS_URL;
  if (process.env.SUPABASE_URL) return `${process.env.SUPABASE_URL}/auth/v1/jwks`;
  return "https://pwxcyrnwhphtdibkswnl.supabase.co/auth/v1/jwks";
}

interface JWK {
  kid: string;
  kty: string;
  x: string;
  y: string;
  crv: string;
  alg: string;
  use: string;
}

interface JWKS {
  keys: JWK[];
}

/**
 * Fetch and return the public CryptoKey for verifying a Supabase JWT.
 *
 * Steps:
 * 1. Decode JWT header to find the Key ID (kid)
 * 2. Return from in-memory cache if available
 * 3. Fetch JWKS from Supabase with a timeout guard
 * 4. Import the JWK as a CryptoKey (Web Crypto API)
 * 5. Cache and return
 */
export async function getSupabasePublicKey(
  token: string
): Promise<CryptoKey> {
  const jwksUrl = getJwksUrl();

  // 1. Decode JWT header to find 'kid'
  const { header } = decode(token);
  const kid = header.kid as string | undefined;

  if (!kid) {
    throw new Error("Token header missing 'kid'");
  }

  // 2. Return from cache if available
  if (keyCache[kid]) {
    return keyCache[kid];
  }

  // 3. Fetch JWKS with timeout guard
  console.log("[JWKS] Fetching from:", jwksUrl);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), JWKS_FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(jwksUrl, { signal: controller.signal });
  } catch (fetchErr: any) {
    clearTimeout(timeoutId);
    if (fetchErr.name === "AbortError") {
      throw new Error(`[JWKS] Fetch timed out after ${JWKS_FETCH_TIMEOUT_MS}ms`);
    }
    throw new Error(`[JWKS] Fetch failed: ${fetchErr.message}`);
  }

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`[JWKS] Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const jwks = await response.json() as JWKS;
  const jwk = jwks.keys.find((k) => k.kid === kid);

  if (!jwk) {
    throw new Error(`[JWKS] No matching key for kid: ${kid}`);
  }

  // 4. Import JWK as CryptoKey (Web Crypto API — works in Node.js 18+)
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDSA", namedCurve: "P-256" }, // ES256
    false,
    ["verify"]
  );

  // 5. Cache it
  keyCache[kid] = key;
  return key;
}
