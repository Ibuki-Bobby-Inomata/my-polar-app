// app/layout.tsx

import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Polar App",
  description: "Polar AccessLink + Next.js + Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        <header className="bg-blue-900 text-white p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="font-bold text-lg">Polar Access App</h1>
            <nav>
              {/* 修正点: <a>ではなく<Link>を使う */}
              <Link href="/" className="ml-4 hover:underline">
                ホーム
              </Link>
              <Link href="/mypage" className="ml-4 hover:underline">
                マイページ
              </Link>
              <Link href="/history" className="ml-4 hover:underline">
                履歴
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 flex justify-center items-center p-4">
          {children}
        </main>
        <footer className="bg-blue-800 text-white text-center p-2">
          &copy; 2025 My Polar App
        </footer>
      </body>
    </html>
  );
}
