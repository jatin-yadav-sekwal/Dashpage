import { decode } from "hono/jwt";

// Use fallback JWKS URL for Cloudflare Workers
const getJwksUrl = (): string => {
  // Try environment variable first
  const envUrl = (globalThis as any).SUPABASE_JWKS_URL || process?.env?.SUPABASE_JWKS_URL;
  if (envUrl) return envUrl;
  
  // Fallback to hardcoded Supabase URL
  return "https://pwxcyrnwhphtdibkswnl.supabase.co/auth/v1/.well-known/jwks.json";
};

// Cache keys in memory: Kid -> CryptoKey
const keyCache: Record<string, CryptoKey> = {};

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

export async function getSupabasePublicKey(token: string): Promise<CryptoKey> {
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
  console.log("Fetching Supabase JWKS...");
  const response = await fetch(getJwksUrl());
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
