export default function HomePage() {
  const clientId = process.env.NEXT_PUBLIC_POLAR_CLIENT_ID ?? process.env.POLAR_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_POLAR_REDIRECT_URI ?? process.env.POLAR_REDIRECT_URI;

  const authorizationUrl = `https://flow.polar.com/oauth2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri || ""
  )}&scope=accesslink.read_all`;

  return (
    <div className="max-w-2xl text-center">
      <h2 className="text-3xl font-bold mb-4">Polarへログイン</h2>
      <p className="text-gray-600 mb-8">
        Polarの認証を通してデータを取得し、心拍数や温度の履歴を管理するアプリです。
      </p>
      <a
        href={authorizationUrl}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Polarログイン
      </a>
    </div>
  );
}
