"use client";
export const dynamic = "force-dynamic"; // ★ 静的生成を無効化する

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState("");

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code) {
            // codeが取れないならホームへ戻す
            router.push("/");
            return;
        }

        // codeがある → /api/oauth へPOST
        fetch("/api/oauth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to exchange code for token");
                return res.json();
            })
            .then((data) => {
                // { access_token, x_user_id }
                sessionStorage.setItem("access_token", data.access_token);
                sessionStorage.setItem("x_user_id", data.x_user_id);
                // マイページへ遷移
                router.push("/mypage");
            })
            .catch((err) => {
                setError(String(err));
            });
    }, [router, searchParams]);

    return (
        <div className="text-center p-4">
            <h2 className="text-xl font-bold mb-2">Polar認可処理中...</h2>
            {error && <p className="text-red-500">エラー: {error}</p>}
        </div>
    );
}
