import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId"); // x_user_id (polar_user_id)
        const from = searchParams.get("from");     // e.g. 2025-01-01
        const to = searchParams.get("to");         // e.g. 2025-01-31

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        // Supabaseクエリ
        // from, to が無い場合のデフォルト範囲処理など適宜実装
        const { data, error } = await supabaseAdmin
            .from("user_measurements")
            .select("*")
            .eq("polar_user_id", userId)
            .gte("measured_at", from || "1900-01-01")
            .lte("measured_at", to || "2100-12-31")
            .order("measured_at", { ascending: false });

        if (error) {
            console.error(error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
