// app/history/page.tsx
"use client";

import React, { useState } from "react";

// Supabaseテーブル 'user_measurements' の行データ型例
type UserMeasurement = {
    id: number;
    polar_user_id: number;
    measured_at: string;   // UTC string
    heart_rate?: number | null;
    temperature?: number | null;
    created_at?: string | null;
};

export default function HistoryPage() {
    const [from, setFrom] = useState("2025-01-01");
    const [to, setTo] = useState("2025-01-31");
    const [records, setRecords] = useState<UserMeasurement[]>([]);

    const [userId, setUserId] = useState("62363341");

    const handleSearch = () => {
        fetch(`/api/history?userId=${userId}&from=${from}&to=${to}`)
            .then((res) => res.json())
            .then((data: UserMeasurement[]) => {
                // data は 配列 と想定
                setRecords(data);
            })
            .catch((err: unknown) => {
                console.error(err);
            });
    };

    return (
        <div className="max-w-xl w-full bg-white p-6 rounded shadow text-gray-800">
            <h1 className="text-xl font-bold mb-4">過去の心拍 & 温度履歴</h1>
            <div className="space-y-2 mb-4">
                <div>
                    <label className="mr-2">Polar User ID:</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                </div>
                <div>
                    <label className="mr-2">From:</label>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <label className="mx-2">To:</label>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <button
                        onClick={handleSearch}
                        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        検索
                    </button>
                </div>
            </div>

            {records.length === 0 ? (
                <p>データがありません</p>
            ) : (
                <table className="w-full border">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 border-b">日時</th>
                            <th className="p-2 border-b">心拍数 (bpm)</th>
                            <th className="p-2 border-b">温度 (℃)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((row) => (
                            <tr key={row.id}>
                                <td className="p-2 border-b">
                                    {new Date(row.measured_at).toLocaleString()}
                                </td>
                                <td className="p-2 border-b">{row.heart_rate ?? "-"}</td>
                                <td className="p-2 border-b">{row.temperature ?? "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
