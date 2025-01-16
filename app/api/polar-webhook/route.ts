// app/api/polar-webhook/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Received Polar Webhook:", body);

        const polarUserId = body["user-id"];
        const eventType = body["event-type"];
        // const transactionId = body["entity_id"]; // ← 未使用なら削除

        if (eventType === "EXERCISE") {
            // ここで exercise-transactions を取得し解析するなど
            // サンプルとして固定値をInsert:
            const now = new Date().toISOString();
            const { error } = await supabaseAdmin.from("user_measurements").insert({
                polar_user_id: polarUserId,
                measured_at: now,
                heart_rate: 75,
                temperature: 36.5,
            });
            if (error) {
                console.error("DB Insert Error:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
