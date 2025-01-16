// app/api/user/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { access_token, x_user_id } = await request.json();

        const headers = {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        };

        // ユーザー登録 (既に登録済みなら 409 返る想定)
        const bodyData = JSON.stringify({ "member-id": "someUserIdInSystem" });
        const regRes = await fetch("https://www.polaraccesslink.com/v3/users", {
            method: "POST",
            headers,
            body: bodyData,
        });
        if (!regRes.ok && regRes.status !== 409) {
            const errText = await regRes.text();
            console.error("User registration error:", errText);
            return NextResponse.json({ error: "User registration failed" }, { status: 400 });
        }

        // Polarユーザー情報GET
        const userInfoRes = await fetch(
            `https://www.polaraccesslink.com/v3/users/${x_user_id}`,
            { method: "GET", headers: { Authorization: `Bearer ${access_token}` } }
        );

        if (!userInfoRes.ok) {
            const errText = await userInfoRes.text();
            console.error("Get user info error:", errText);
            return NextResponse.json({ error: "Failed to get user info" }, { status: 400 });
        }

        const userInfo = await userInfoRes.json();
        return NextResponse.json({ userInfo });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
