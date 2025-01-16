import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (!code) {
      return NextResponse.redirect("/");
    }

    // Polar OAuth
    const clientId = process.env.POLAR_CLIENT_ID!;
    const clientSecret = process.env.POLAR_CLIENT_SECRET!;
    const redirectUri = `${process.env.POLAR_REDIRECT_URI}`;

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);

    const polarRes = await fetch("https://polarremote.com/v2/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json;charset=UTF-8",
      },
      body: params,
    });
    if (!polarRes.ok) {
      console.error(await polarRes.text());
      return NextResponse.redirect("/?error=polar_token_failed");
    }

    const tokenJson = await polarRes.json();
    // { access_token, x_user_id, ... }

    // Cookieに保存してマイページへリダイレクト
    const response = NextResponse.redirect("/mypage");
    response.cookies.set("polar_access_token", tokenJson.access_token, {
      path: "/",
      httpOnly: true,
      maxAge: 3600,
    });
    response.cookies.set("polar_x_user_id", String(tokenJson.x_user_id), {
      path: "/",
      httpOnly: true,
      maxAge: 3600,
    });

    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.redirect("/?error=unknown");
  }
}
