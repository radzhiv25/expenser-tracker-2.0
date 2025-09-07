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
                name: "Reports",
                href: "/reports",
                icon: BarChart3,
                description: "Charts and analytics"
            },
            {
                name: "Prices",
                href: "/prices",
                icon: DollarSign,
                description: "Price tracking"
            }
        ]
    },
    {
        name: "Settings",
        type: "section",
        children: [
            {
                name: "Settings",
                href: "/settings",
                icon: Settings,
                description: "App configuration"
            }
        ]
    }
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<{ $id: string; name: string; email: string } | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
    const router = useRouter();
    const pathname = usePathname();
    const breadcrumbs = useBreadcrumbs();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await AuthService.getCurrentUser();
                if (!currentUser) {
                    router.push('/login');
                    return;
                }
                setUser(currentUser);
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const toggleSection = (sectionName: string) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Enhanced Sidebar */}
                <div className={`
                    fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white shadow-xl border-r border-gray-200 min-h-screen transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg flex-shrink-0">
                                        <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Expense Tracker</h2>
                                        <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Enterprise Edition</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="lg:hidden p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
                                >
                                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                            <nav className="space-y-1 sm:space-y-2">
                                {navigation.map((section) => (
                                    <div key={section.name}>
                                        <button
                                            onClick={() => toggleSection(section.name)}
                                            className="flex items-center justify-between w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <span className="flex items-center gap-1 sm:gap-2">
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    {section.name}
                                                </span>
                                            </span>
                                            {collapsedSections[section.name] ? (
                                                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                            )}
                                        </button>

                                        {!collapsedSections[section.name] && (
                                            <div className="ml-2 sm:ml-4 space-y-1">
                                                {section.children.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        onClick={() => setSidebarOpen(false)}
                                                        className={`group flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${pathname === item.href
                                                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        <item.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium truncate">{item.name}</div>
                                                            <div className="text-xs text-gray-500 truncate hidden sm:block">
                                                                {item.description}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* User Profile Section */}
                        <div className="p-3 sm:p-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium">
                                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                        {user?.name || 'User'}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate hidden sm:block">
                                        {user?.email}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
                                    title="Logout"
                                >
                                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                            </div>
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
                                        {pathname === '/dashboard' ? 'Dashboard' :
                                            pathname === '/boards' ? 'Kanban Boards' :
                                                pathname === '/expenses' ? 'Expenses' :
                                                    pathname === '/prices' ? 'Price Tracking' :
                                                        pathname === '/reports' ? 'Reports & Analytics' :
                                                            pathname === '/settings' ? 'Settings' : 'Dashboard'}
                                    </h1>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">
                                        {pathname === '/dashboard' ? 'Overview and quick actions' :
                                            pathname === '/boards' ? 'Manage your workflow with Kanban boards' :
                                                pathname === '/expenses' ? 'Track and manage your expenses' :
                                                    pathname === '/prices' ? 'Monitor price changes and trends' :
                                                        pathname === '/reports' ? 'Comprehensive analytics and insights' :
                                                            pathname === '/settings' ? 'Configure your application settings' : 'Welcome to your dashboard'}
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
                                                    <BreadcrumbPage className="truncate max-w-[150px] sm:max-w-none">{breadcrumb.label}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink asChild>
                                                        <Link href={breadcrumb.href || "/"} className="truncate max-w-[150px] sm:max-w-none">{breadcrumb.label}</Link>
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="mx-1 sm:mx-2" />}
                                        </React.Fragment>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>

                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}