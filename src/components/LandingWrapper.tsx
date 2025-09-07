"use client";

import dynamic from "next/dynamic";

const Layout = dynamic(
    () => import("./layout/Layout").then(mod => ({ default: mod.Layout })),
    { 
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }
);

const HomePage = dynamic(
    () => import("./pages/HomePage").then(mod => ({ default: mod.HomePage })),
    { 
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }
);

export default function LandingWrapper() {
    return (
        <Layout>
            <HomePage />
        </Layout>
    );
}
