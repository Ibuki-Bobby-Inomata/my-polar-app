// app/login/page.tsx

"use client";
export const dynamic = "force-dynamic"; // ★ これを追加してSSGを無効化

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState("");

    useEffect(() => {
        const code = searchParams.get("code");
        if (code) {
            fetch("/api/oauth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Token fetch failed");
                    return res.json();
                })
                .then((data) => {
                    // { access_token, x_user_id }
                    sessionStorage.setItem("access_token", data.access_token);
                    sessionStorage.setItem("x_user_id", data.x_user_id);
                    router.push("/mypage");
                })
                .catch((err) => setError(String(err)));
        }
    }, [router, searchParams]);

    return (
        <div>
            <h2>Polar認可処理中...</h2>
            {error && <p style={{ color: "red" }}>エラー: {error}</p>}
        </div>
    );
}
