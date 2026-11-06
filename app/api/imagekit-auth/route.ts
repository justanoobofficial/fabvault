import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomUUID } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";

export const runtime = "nodejs";
const firebaseKeys = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

export async function GET(request: NextRequest) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!projectId || !privateKey || !publicKey || !token) {
      return NextResponse.json({ error: "Image uploads are not configured." }, { status: 503 });
    }

    const { payload } = await jwtVerify(token, firebaseKeys, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      algorithms: ["RS256"],
    });
    if (payload.email !== "support.fabuyodevs@gmail.com" || payload.email_verified !== true) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

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
