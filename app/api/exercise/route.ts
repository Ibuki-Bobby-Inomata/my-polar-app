// app/api/exercise/route.ts

import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // ここで何か処理をし、レスポンスを返す
    // たとえば・・・
    return NextResponse.json({ message: "GET /api/exercise is working!" });
}

// 必要なら POST なども追加
export async function POST(request: Request) {
    // JSONを受け取って、Polar AccessLinkを叩くなど
    const body = await request.json();
    console.log("POST to /api/exercise => body:", body);

    // 処理して結果を返す
    return NextResponse.json({ status: "ok" });
}
