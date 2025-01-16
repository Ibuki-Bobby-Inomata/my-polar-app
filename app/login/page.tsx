"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";


export const dynamic = "force-dynamic"; // 静的生成を無効化し、動的レンダリングに変更

export default function LoginPage() {
    const searchParams = useSearchParams(); // クエリパラメータを取得
    const router = useRouter();
    const [error, setError] = useState<string | null>(null); // エラー表示用

    useEffect(() => {
        const code = searchParams.get("code"); // "code" パラメータを取得
        if (!code) {
            setError("認可コードが見つかりません。トップページに戻ります。");
            setTimeout(() => router.push("/"), 3000); // ホームへ自動リダイレクト
            return;
        }

        // code を使用してアクセストークンを取得
        fetch("/api/oauth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("トークン取得に失敗しました。");
                }
                return res.json();
            })
            .then((data) => {
                // トークンとユーザーIDを保存
                sessionStorage.setItem("access_token", data.access_token);
                sessionStorage.setItem("x_user_id", data.x_user_id);
                console.log("認証成功: ", data);

                // マイページへリダイレクト
                router.push("/mypage");
            })
            .catch((err) => {
                console.error(err);
                setError("認証処理中にエラーが発生しました。");
            });
    }, [searchParams, router]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Suspense>
                <h2>Polar認証処理中...</h2>
                {error && (
                    <p style={{ color: "red", marginTop: "20px" }}>
                        {error}
                        <br />
                        数秒後にホームにリダイレクトされます。
                    </p>
                )}
            </Suspense>
        </div>
    );
}
