import Link from "next/link";

interface FooterProps {
    className?: string;
}

export function Footer({ className = "" }: FooterProps) {
    const footerSections = [
        {
            title: "Product",
            links: [
                { href: "#features", label: "Features" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/login", label: "Login" },
            ]
        },
        {
            title: "Company",
            links: [
                { href: "#about", label: "About" },
                { href: "#contact", label: "Contact" },
            ]
        },
        {
            title: "Support",
            links: [
                { href: "#help", label: "Help" },
                { href: "#privacy", label: "Privacy" },
                { href: "#terms", label: "Terms" },
            ]
        }
    ];

    return (
        <footer className={`bg-gray-900 text-white py-12 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center mb-4">
                            <span className="text-xl font-bold">Finboard</span>
                        </div>
                        <p className="text-gray-400">
                            The simplest way to track and manage your expenses.
                        </p>
                    </div>

                    {/* Footer Links */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-2 text-gray-400">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className="hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 Finboard. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
