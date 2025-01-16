// app/api/oauth/callback/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (!code) {
      // codeが無い場合はホーム画面へ飛ばすなど
      return NextResponse.redirect("/");
    }

    const clientId = process.env.POLAR_CLIENT_ID!;
    const clientSecret = process.env.POLAR_CLIENT_SECRET!;
    const redirectUri = `${process.env.POLAR_REDIRECT_URI}`;

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);

    // Polarからアクセストークン取得
    const res = await fetch("https://polarremote.com/v2/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json;charset=UTF-8",
      },
      body: params,
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Polar OAuth Error:", errorText);
      return NextResponse.redirect("/?error=polar_auth_failed");
    }

    const tokenResponse = await res.json();
    // 例: { access_token, x_user_id, token_type, expires_in, ... }

    // ここでアクセストークンやx_user_idを保存する必要がある
    // === 「サーバーサイドのセッション or Cookie or DB」などに格納 ===
    // 今回はシンプルにCookieに入れてみる例 (JWTではなく生値に注意)
    // (安全性を考慮するならHTTPOnly Cookieなどで保護)
    const response = NextResponse.redirect("/mypage");
    response.cookies.set("polar_access_token", tokenResponse.access_token, {
      httpOnly: true,
      path: "/",
      maxAge: 3600, // 1時間 etc.
    });
    response.cookies.set("polar_x_user_id", String(tokenResponse.x_user_id), {
      httpOnly: true,
      path: "/",
      maxAge: 3600,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.redirect("/?error=unknown");
  }
}
