// app/login/page.tsx

import React, { Suspense } from "react";
import LoadingIndicator from "./LoadingIndicator"; // ローディングコンポーネント (必要に応じて作成)
import LoginHandler from "./LoginHandler"; // クライアントコンポーネント

export default function LoginPage() {
    return (
        <Suspense fallback={<LoadingIndicator />}>
            <LoginHandler />
        </Suspense>
    );
}
