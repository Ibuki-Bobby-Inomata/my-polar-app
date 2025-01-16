import React from "react";

export default function HomePage() {
  // ここで redirectUri を `/api/oauth/callback` に書き換える
  const clientId = process.env.POLAR_CLIENT_ID;
  const redirectUri = `https://${process.env.POLAR_REDIRECT_URI}.vercel.app/api/oauth/callback`;
  // ↑ Vercel本番URLなどに合わせる

  const authorizationUrl = `https://flow.polar.com/oauth2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=accesslink.read_all`;

  return (
    <div className="text-center max-w-2xl">
      <h2 className="text-3xl font-bold mb-4">ようこそ！</h2>
      <p className="text-gray-600 mb-8">
        Polar AccessLink APIを利用したデータ管理アプリへようこそ。
        <br />
        ログインしてデータを確認できます。
      </p>
      <a
        href={authorizationUrl}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
      >
        Polarにログイン
      </a>
    </div>
  );
}
