"use client";
import { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/auth";

interface DashboardLayoutProps {
    children: ReactNode;
    className?: string;
}

export function DashboardLayout({ children, className = "" }: DashboardLayoutProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            router.push('/');
        } catch (error) {
            console.error('Error logging out:', error);
            // Still redirect even if logout fails
            router.push('/');
        }
    };

    return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Finboard</h1>
                        </div>
                        <Button onClick={handleLogout} variant="outline">
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>
        </div>
    );
}
