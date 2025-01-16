import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    console.log("Received code:", code);

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const clientId = process.env.POLAR_CLIENT_ID!;
    const clientSecret = process.env.POLAR_CLIENT_SECRET!;
    const redirectUri = process.env.POLAR_REDIRECT_URI!;

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);

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
      console.error("Polar API Error:", errorText);
      return NextResponse.json({ error: "Failed to get token", details: errorText }, { status: res.status });
    }

    const tokenResponse = await res.json();
    console.log("Token Response:", tokenResponse);

    return NextResponse.json({
      access_token: tokenResponse.access_token,
      x_user_id: tokenResponse.x_user_id,
    });
  } catch (error) {
    console.error("Error in /api/oauth:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
