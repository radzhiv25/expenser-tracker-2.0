"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { AuthService } from "@/lib/auth";
import {
    LayoutDashboard,
    Kanban,
    Receipt,
    DollarSign,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Building2
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigation = [
    {
        name: "Platform",
        type: "section",
        children: [
            {
                name: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
                description: "Overview and quick actions"
            },
            {
                name: "Boards",
                href: "/boards",
                icon: Kanban,
                description: "Kanban workflow management"
            },
            {
                name: "Expenses",
                href: "/expenses",
                icon: Receipt,
                description: "Manage your expenses"
            }
        ]
    },
    {
        name: "Analytics",
        type: "section",
        children: [
            {
                name: "Price Tracking",
                href: "/prices",
                icon: DollarSign,
                description: "Monitor price changes and trends"
            },
            {
                name: "Reports",
                href: "/reports",
                icon: BarChart3,
                description: "Comprehensive analytics and insights"
            }
        ]
    },
    {
        name: "Account",
        type: "section",
        children: [
            {
                name: "Settings",
                href: "/settings",
                icon: Settings,
                description: "Configure your application settings"
            }
        ]
    }
];

interface DashboardClientLayoutProps {
    children: React.ReactNode;
}

export default function DashboardClientLayout({ children }: DashboardClientLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const breadcrumbs = useBreadcrumbs();
    const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        Platform: true,
        Analytics: true,
        Account: true
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await AuthService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const toggleSection = (sectionName: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const getPageTitle = () => {
        if (!pathname) return 'Dashboard';
        switch (pathname) {
            case '/dashboard': return 'Dashboard';
            case '/boards': return 'Kanban Boards';
            case '/expenses': return 'Expenses';
            case '/prices': return 'Price Tracking';
            case '/reports': return 'Reports & Analytics';
            case '/settings': return 'Settings';
            default: return 'Dashboard';
        }
    };

    const getPageDescription = () => {
        if (!pathname) return 'Welcome to your dashboard';
        switch (pathname) {
            case '/dashboard': return 'Overview and quick actions';
            case '/boards': return 'Manage your workflow with Kanban boards';
            case '/expenses': return 'Track and manage your expenses';
            case '/prices': return 'Monitor price changes and trends';
            case '/reports': return 'Comprehensive analytics and insights';
            case '/settings': return 'Configure your application settings';
            default: return 'Welcome to your dashboard';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <Building2 className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold text-gray-900">ExpenseTracker</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((section) => (
                        <div key={section.name}>
                            <button
                                onClick={() => toggleSection(section.name)}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <span>{section.name}</span>
                                {expandedSections[section.name] ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </button>
                            {expandedSections[section.name] && (
                                <div className="ml-4 space-y-1">
                                    {section.children?.map((item) => {
                                        const isActive = pathname === item.href;
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                                    isActive
                                                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                                <div className="flex-1">
                                                    <div>{item.name}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* User section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <div className="flex items-center">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user.email}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="ml-2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            title="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
                <header className="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
                            >
                                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                                    {getPageTitle()}
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">
                                    {getPageDescription()}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
                    
                    {/* Breadcrumbs */}
                    <div className="mb-4 sm:mb-6">
                        <Breadcrumb>
                            <BreadcrumbList className="flex-wrap">
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <React.Fragment key={breadcrumb.href || index}>
                                        <BreadcrumbItem className="text-xs sm:text-sm">
                                            {breadcrumb.isCurrentPage ? (
                                                <BreadcrumbPage className="font-medium text-gray-900">
                                                    {breadcrumb.label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link href={breadcrumb.href || '#'} className="text-gray-600 hover:text-gray-900">
                                                        {breadcrumb.label}
                                                    </Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        {index < breadcrumbs.length - 1 && (
                                            <BreadcrumbSeparator className="text-gray-400" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    {/* Page content */}
                    <div className="space-y-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
