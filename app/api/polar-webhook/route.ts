import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// 例: Webhook body => {
//   "user-id": 62363341,
//   "event-type": "EXERCISE",
//   "entity_id": 987654321, // exercise transaction-id など
//   ...
// }

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Received Polar Webhook:", body);

        const polarUserId = body["user-id"];
        const eventType = body["event-type"];
        const transactionId = body["entity_id"];

        if (eventType === "EXERCISE") {
            // ここで実際に "exercise-transactions" から詳しいデータを取る
            // (access_tokenをどこで管理するかがポイント。
            //  Webhookだけではaccess_tokenがわからないので、各ユーザーごとにDB管理しておく方法などが必要)
            // 参考: 1) userテーブルにaccess_tokenを保存する / 2) 期限切れ対応 etc.

            // 簡易サンプル: HeartRate & Temperatureを固定値でINSERT (実装サンプル用)
            const now = new Date().toISOString();
            const { error } = await supabaseAdmin.from("user_measurements").insert({
                polar_user_id: polarUserId,
                measured_at: now,
                heart_rate: 75,
                temperature: 36.5,
            });
            if (error) {
                console.error(error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error: any) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
