import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MyPage() {
    const store = cookies();
    const accessToken = store.get("polar_access_token")?.value;
    const xUserId = store.get("polar_x_user_id")?.value;

    if (!accessToken || !xUserId) {
        // Cookieなければ未ログイン → ホームへリダイレクト
        redirect("/");
    }

    // Polar AccessLinkからユーザー情報取得
    const userRes = await fetch(`https://www.polaraccesslink.com/v3/users/${xUserId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!userRes.ok) {
        // 失敗 → ホームへ
        redirect("/?error=user_info_failed");
    }
    const userInfo = await userRes.json();

    return (
        <div className="max-w-md w-full bg-white p-6 rounded shadow text-gray-800">
            <h2 className="text-xl font-bold mb-4">マイページ</h2>
            <ul className="space-y-2">
                <li>登録日: {userInfo["registration-date"] || "N/A"}</li>
                <li>名前: {userInfo["first-name"]} {userInfo["last-name"]}</li>
                <li>誕生日: {userInfo.birthdate || "N/A"}</li>
                <li>性別: {userInfo.gender || "N/A"}</li>
            </ul>
        </div>
    );
}
