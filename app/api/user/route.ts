import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { access_token, x_user_id } = await request.json();
        // x_user_id = 62363341 など

        // Polar AccessLink ユーザー登録
        const headers = {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        };

        // 登録用
        const bodyData = JSON.stringify({
            "member-id": "yourSystemUserIdHere", // 任意
        });

        // (すでに登録済みかもしれないので、POST→status===409ならスキップ)
        const registerRes = await fetch("https://www.polaraccesslink.com/v3/users", {
            method: "POST",
            headers,
            body: bodyData,
        });

        if (!registerRes.ok && registerRes.status !== 409) {
            const errText = await registerRes.text();
            console.error("User registration error:", errText);
            return NextResponse.json({ error: "User registration failed" }, { status: 400 });
        }

        // ユーザー情報をGET
        const userInfoRes = await fetch(
            `https://www.polaraccesslink.com/v3/users/${x_user_id}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${access_token}` },
            }
        );
        if (!userInfoRes.ok) {
            const errText = await userInfoRes.text();
            console.error("Get user info error:", errText);
            return NextResponse.json({ error: "Failed to get user info" }, { status: 400 });
        }
        const userInfo = await userInfoRes.json();
        // userInfo例: {
        //   "polar-user-id": 62363341,
        //   "registration-date": "2025-01-01",
        //   "first-name": "Taro",
        //   "last-name": "Polar",
        //   "birthdate": "1990-01-01",
        //   "gender": "MALE",
        //   ...
        // }

        return NextResponse.json({ userInfo });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
