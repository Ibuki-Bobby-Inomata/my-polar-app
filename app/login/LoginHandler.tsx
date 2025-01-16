// app/login/LoginHandler.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get("code");

        if (!code) {
            setError("認可コードが見つかりません。トップページに戻ります。");
            setTimeout(() => router.push("/"), 3000); // 3秒後にリダイレクト
            return;
        }

        fetch("/api/oauth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("トークン取得に失敗しました。");
                }
                return res.json();
            })
            .then((data) => {
                sessionStorage.setItem("access_token", data.access_token);
                sessionStorage.setItem("x_user_id", data.x_user_id);
                router.push("/mypage"); // マイページへ移動
            })
            .catch((err) => {
                console.error(err);
                setError("認証処理中にエラーが発生しました。");
            });
    }, [searchParams, router]);

    if (error) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>エラー</h2>
                <p style={{ color: "red" }}>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>認証処理中...</h2>
        </div>
    );
}
