"use client";

import dynamic from "next/dynamic";

const DashboardClientLayout = dynamic(
    () => import("./DashboardClientLayout"),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        )
    }
);

interface DashboardWrapperProps {
    children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
    return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
