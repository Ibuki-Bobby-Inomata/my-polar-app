"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
                .catch((err) => setError(err.message));
        }
    }, [router, searchParams]);

    return (
        <div className="max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Polar認可処理中...</h2>
            {error && <p className="text-red-500">エラー: {error}</p>}
        </div>
    );
}
