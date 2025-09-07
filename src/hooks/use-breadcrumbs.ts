"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isCurrentPage?: boolean;
}

const routeMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/boards": "Boards",
    "/expenses": "Expenses",
    "/prices": "Prices",
    "/reports": "Reports",
    "/settings": "Settings",
    "/login": "Login",
    "/signup": "Sign Up",
};

export function useBreadcrumbs(): BreadcrumbItem[] {
    const pathname = usePathname();

    return useMemo(() => {
        const segments = pathname.split("/").filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [
            { label: "Home", href: "/" }
        ];

        let currentPath = "";

        for (const segment of segments) {
            currentPath += `/${segment}`;
            const label = routeMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);

            breadcrumbs.push({
                label,
                href: currentPath,
                isCurrentPage: currentPath === pathname
            });
        }

        return breadcrumbs;
    }, [pathname]);
}



