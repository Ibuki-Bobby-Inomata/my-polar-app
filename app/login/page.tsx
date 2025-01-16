"use client";
export const dynamic = "force-dynamic"; // ★ これを追加して静的生成を無効化

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState("");

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code) {
            router.push("/");
            return;
        }

        // codeがある場合、トークンを取得
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
                sessionStorage.setItem("access_token", data.access_token);
                sessionStorage.setItem("x_user_id", data.x_user_id);
                router.push("/mypage");
            })
            .catch((err) => {
                setError(String(err));
            });
    }, [router, searchParams]);

    return (
        <div className="text-center p-4">
            <h2 className="text-xl font-bold mb-4">Polar認可処理中...</h2>
            {error && <p className="text-red-500">エラー: {error}</p>}
        </div>
    );
}
