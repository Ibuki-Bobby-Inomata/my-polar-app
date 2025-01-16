// app/api/history/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        // Supabaseクエリ
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
