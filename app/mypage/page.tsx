/* eslint no-unused-vars: 0 */

"use client";
export const dynamic = "force-dynamic"; // ★ 静的生成を無効化

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyPage() {
    const [userInfo, setUserInfo] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const access_token = sessionStorage.getItem("access_token");
        const x_user_id = sessionStorage.getItem("x_user_id");
        if (!access_token || !x_user_id) {
            // トークン無い → ホームへ
            router.push("/");
            return;
        }

        // /api/user にアクセスし Polarユーザー情報をGET
        fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token, x_user_id }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) throw new Error(data.error);
                setUserInfo(data.userInfo);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [router]);

    if (!userInfo) {
        return <p className="p-4">読み込み中...</p>;
    }

    return (
        <div className="max-w-md bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">マイページ</h2>
            <ul className="space-y-2">
                <li>登録日: {userInfo["registration-date"] || "N/A"}</li>
                <li>
                    名前: {userInfo["first-name"]} {userInfo["last-name"]}
                </li>
                <li>誕生日: {userInfo.birthdate || "N/A"}</li>
                <li>性別: {userInfo.gender || "N/A"}</li>
            </ul>
        </div>
    );
}
