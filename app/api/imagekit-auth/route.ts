import { NextRequest, NextResponse } from "next/server";
import { createHmac, createPublicKey, randomUUID, verify as verifySignature } from "node:crypto";

export const runtime = "nodejs";

type FirebaseJwk = { kid: string; kty: string; n: string; e: string; alg?: string; use?: string };

async function verifyFirebaseToken(token: string, projectId: string) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token");
  const decode = (value: string) => JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  const header = decode(parts[0]);
  const payload = decode(parts[1]);
  if (header.alg !== "RS256" || !header.kid) throw new Error("Invalid token header");

  const response = await fetch("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not verify sign-in");
  const keys = await response.json() as { keys: FirebaseJwk[] };
  const jwk = keys.keys.find((key) => key.kid === header.kid);
  if (!jwk) throw new Error("Unknown signing key");
  const publicKey = createPublicKey({ key: jwk as any, format: "jwk" });
  const valid = verifySignature(
    "RSA-SHA256",
    Buffer.from(`${parts[0]}.${parts[1]}`),
    publicKey,
    Buffer.from(parts[2], "base64url")
  );
  const now = Math.floor(Date.now() / 1000);
  if (!valid || payload.aud !== projectId ||
      payload.iss !== `https://securetoken.google.com/${projectId}` ||
      typeof payload.exp !== "number" || payload.exp <= now ||
      payload.email !== "support.fabuyodevs@gmail.com" ||
      payload.email_verified !== true) {
    throw new Error("Admin authentication failed");
  }
}

export async function GET(request: NextRequest) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const token = request.headers.get("authorization")?.replace(/^Bearer\\s+/i, "");
    if (!projectId || !privateKey || !publicKey || !token) {
      return NextResponse.json({ error: "Image uploads are not configured." }, { status: 503 });
    }

    await verifyFirebaseToken(token, projectId);
    const expire = Math.floor(Date.now() / 1000) + 30 * 60;
    const uploadToken = randomUUID();
    const signature = createHmac("sha1", privateKey)
      .update(uploadToken + expire)
      .digest("hex");
    return NextResponse.json({ token: uploadToken, expire, signature, publicKey });
  } catch {
    return NextResponse.json({ error: "Admin authentication failed." }, { status: 401 });
  }
}
