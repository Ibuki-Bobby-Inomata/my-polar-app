// app/mypage/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MyPage() {
    // サーバーコンポーネントでCookie取得
    const store = cookies();
    const accessToken = store.get("polar_access_token")?.value;
    const xUserId = store.get("polar_x_user_id")?.value;

    if (!accessToken || !xUserId) {
        // 未ログインなのでホームへリダイレクト
        redirect("/");
    }

    // Polarからユーザー情報を取得
    const userInfo = await fetch(
        `https://www.polaraccesslink.com/v3/users/${xUserId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    ).then((res) => {
        if (!res.ok) return null;
        return res.json();
    });

    if (!userInfo) {
        // 失敗したらエラー表示 or リダイレクト
        redirect("/?error=user_info_failed");
    }

    // userInfo例: {
    //   "registration-date": "2022-10-01",
    //   "first-name": "Taro",
    //   "last-name": "Polar",
    //   "birthdate": "1990-01-01",
    //   "gender": "MALE",
    //   ...
    // }

    return (
        <div className="max-w-md w-full bg-white p-6 rounded shadow text-gray-800">
            <h2 className="text-xl font-bold mb-4">ユーザープロフィール</h2>
            <ul className="space-y-2">
                <li>
                    <b>登録日:</b> {userInfo["registration-date"]}
                </li>
                <li>
                    <b>名前:</b> {userInfo["first-name"]} {userInfo["last-name"]}
                </li>
                <li>
                    <b>誕生日:</b> {userInfo.birthdate}
                </li>
                <li>
                    <b>性別:</b> {userInfo.gender}
                </li>
            </ul>
        </div>
    );
}
