"use client";

import dynamic from "next/dynamic";

const LoginForm = dynamic(
    () => import("./login-form").then(mod => ({ default: mod.LoginForm })),
    {
        ssr: false,
        loading: () => (
            <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    </div>
                </div>
            </div>
        )
    }
);

export default function LoginWrapper() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm />
            </div>
        </div>
    );
}
