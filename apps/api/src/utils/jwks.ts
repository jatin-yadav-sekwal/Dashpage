import { decode } from "hono/jwt";

// Cache keys in memory: Kid -> CryptoKey
const keyCache: Record<string, CryptoKey> = {};
/**
 * Get the Supabase JWKS URL from environment or fallback to standard URL
 */
export function getJwksUrl(env?: { SUPABASE_URL?: string, SUPABASE_JWKS_URL?: string }) {
  // Prefer explicit JWKS URL if provided
  if (env?.SUPABASE_JWKS_URL) return env.SUPABASE_JWKS_URL;
  if (process.env.SUPABASE_JWKS_URL) return process.env.SUPABASE_JWKS_URL;

  // Fallback to deriving from SUPABASE_URL
  const supabaseUrl = env?.SUPABASE_URL || process.env.SUPABASE_URL || "https://uofmxtivrqshuekmdyia.supabase.co";
  return `${supabaseUrl}/auth/v1/jwks`;
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
 * Fetch and return the public key for Supabase JWT verification
 */
export async function getSupabasePublicKey(token: string, env?: { SUPABASE_URL?: string, SUPABASE_JWKS_URL?: string }): Promise<CryptoKey> {
  const jwksUrl = getJwksUrl(env);
  // 1. Decode header to find 'kid' (Key ID)
  const { header } = decode(token);
  const kid = header.kid;

  if (!kid) {
    throw new Error("Token header missing 'kid'");
  }

  // 2. Check Cache
  if (keyCache[kid]) {
    return keyCache[kid];
  }

  // 3. Fetch JWKS if not in cache
  console.log("Fetching Supabase JWKS from:", jwksUrl);
  const response = await fetch(jwksUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch JWKS: ${response.statusText}`);
  }

  const jwks: JWKS = await response.json();
  const jwk = jwks.keys.find((k) => k.kid === kid);

  if (!jwk) {
    throw new Error(`No matching key found in JWKS for kid: ${kid}`);
  }

  // 4. Import JWK as CryptoKey (Web Crypto API)
  // Supabase uses EC (Elliptic Curve) keys for ES256
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "ECDSA",
      namedCurve: "P-256", // ES256 uses P-256
    },
    false, // not extractable
    ["verify"]
  );

  // 5. Store in cache
  keyCache[kid] = key;

  return key;
}
