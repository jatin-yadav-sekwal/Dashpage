import { decode } from "hono/jwt";

// Cache keys in memory: kid -> CryptoKey
// Valid for the lifetime of the isolate (warm requests benefit, cold starts re-fetch)
const keyCache: Record<string, CryptoKey> = {};

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
 */
export async function getSupabasePublicKey(
  token: string
): Promise<CryptoKey> {
  const jwksUrl = getJwksUrl();

  // 1. Decode JWT header to find 'kid' (Key ID)
  const { header } = decode(token);
  const kid = header.kid as string | undefined;

  if (!kid) {
    throw new Error("Token header missing 'kid'");
  }

  // 2. Return from cache if available
  if (keyCache[kid]) {
    return keyCache[kid];
  }

  // 3. Fetch JWKS
  console.log("[JWKS] Fetching from:", jwksUrl);
  const response = await fetch(jwksUrl);
  if (!response.ok) {
    throw new Error(`[JWKS] Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const jwks = await response.json() as JWKS;
  const jwk = jwks.keys.find((k) => k.kid === kid);

  if (!jwk) {
    throw new Error(`[JWKS] No matching key for kid: ${kid}`);
  }

  // 4. Import JWK as CryptoKey (Web Crypto API — works in Workers natively)
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
