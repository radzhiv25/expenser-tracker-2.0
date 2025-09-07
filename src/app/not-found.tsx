import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page not found</h2>
                <p className="text-gray-600 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
                <Link href="/">
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg">
                        Go to homepage
                    </Button>
                </Link>
            </div>
        </div>
    );
}
