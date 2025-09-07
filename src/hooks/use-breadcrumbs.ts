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
        // Return default breadcrumbs if pathname is undefined or not a string
        if (!pathname || typeof pathname !== 'string') {
            return [{ label: "Home", href: "/" }];
        }

        try {
            const segments = pathname.split("/").filter(Boolean);
            const breadcrumbs: BreadcrumbItem[] = [
                { label: "Home", href: "/" }
            ];

            let currentPath = "";

            for (const segment of segments) {
                if (typeof segment !== 'string') continue;
                
                currentPath += `/${segment}`;
                const label = routeMap[currentPath] || (segment.charAt(0)?.toUpperCase() || '') + segment.slice(1);

                breadcrumbs.push({
                    label,
                    href: currentPath,
                    isCurrentPage: currentPath === pathname
                });
            }

            return breadcrumbs;
        } catch (error) {
            // Fallback to default breadcrumbs if any error occurs
            console.warn('Error generating breadcrumbs:', error);
            return [{ label: "Home", href: "/" }];
        }
    }, [pathname]);
}



