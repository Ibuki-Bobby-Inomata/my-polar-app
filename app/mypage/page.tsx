// app/mypage/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Polarユーザー情報の例
type PolarUserInfo = {
    "registration-date"?: string;
    "first-name"?: string;
    "last-name"?: string;
    birthdate?: string;
    gender?: string;
    // 他に必要なフィールドがあれば追加
};

export default function MyPage() {
    const [userInfo, setUserInfo] = useState<PolarUserInfo | null>(null);
    const router = useRouter();

    useEffect(() => {
        const access_token = sessionStorage.getItem("access_token");
        const x_user_id = sessionStorage.getItem("x_user_id");

        if (!access_token || !x_user_id) {
            router.push("/");
            return;
        }

        fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token, x_user_id }),
        })
            .then((res) => res.json())
            .then((data: { userInfo?: PolarUserInfo; error?: string }) => {
                if (data.error) {
                    throw new Error(data.error);
                }
                setUserInfo(data.userInfo || null);
            })
            .catch((err: unknown) => {
                console.error(err);
            });
    }, [router]);

    if (!userInfo) {
        return (
            <div className="text-center">
                <p>ユーザー情報を読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md w-full bg-white p-6 rounded shadow text-gray-800">
            <h2 className="text-xl font-bold mb-4">ユーザープロフィール</h2>
            <ul className="space-y-2">
                <li className="flex justify-between">
                    <span className="text-gray-500">登録日:</span>
                    <span>{userInfo["registration-date"] || "N/A"}</span>
                </li>
                <li className="flex justify-between">
                    <span className="text-gray-500">名前:</span>
                    <span>
                        {userInfo["first-name"]} {userInfo["last-name"]}
                    </span>
                </li>
                <li className="flex justify-between">
                    <span className="text-gray-500">誕生日:</span>
                    <span>{userInfo.birthdate || "N/A"}</span>
                </li>
                <li className="flex justify-between">
                    <span className="text-gray-500">性別:</span>
                    <span>{userInfo.gender || "N/A"}</span>
                </li>
            </ul>
        </div>
    );
}
