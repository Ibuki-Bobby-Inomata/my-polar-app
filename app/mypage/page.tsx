"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Polarユーザー情報の型を定義
type PolarUserInfo = {
    "registration-date": string;
    "first-name": string;
    "last-name": string;
    birthdate: string;
    gender: string;
};

export default function MyPage() {
    const [userInfo, setUserInfo] = useState<PolarUserInfo | null>(null); // 修正: 型を明示
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
            .then((data) => {
                if (data.error) throw new Error(data.error);
                setUserInfo(data.userInfo);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [router]);

    if (!userInfo) {
        return <p>読み込み中...</p>;
    }

    return (
        <div className="max-w-md bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">マイページ</h2>
            <ul className="space-y-2">
                <li>登録日: {userInfo["registration-date"]}</li>
                <li>
                    名前: {userInfo["first-name"]} {userInfo["last-name"]}
                </li>
                <li>誕生日: {userInfo.birthdate}</li>
                <li>性別: {userInfo.gender}</li>
            </ul>
        </div>
    );
}
