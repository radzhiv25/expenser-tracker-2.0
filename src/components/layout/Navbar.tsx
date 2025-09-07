"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface NavbarProps {
    className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { href: "#features", label: "Features" },
        { href: "#about", label: "About" },
        { href: "#contact", label: "Contact" },
    ];

    return (
        <nav className={`bg-white/90 w-3/4 mx-auto rounded-md backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5 sticky top-4 z-50 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 ${className}`}>
            <div className="px-6 sm:px-8 lg:px-10">
                <div className="flex justify-center items-center h-16">
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-between w-full">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center"
                        >
                            <Link href="/" className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-gray-900">Finboard</span>
                            </Link>
                        </motion.div>

                        {/* Navigation Items */}
                        <div className="flex items-center space-x-1">
                            {navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200 font-medium"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-2">
                            <Link href="/signup">
                                <Button variant="outline" className="border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                                    Sign Up
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200">
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center justify-between w-full">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-gray-900">Finboard</span>
                        </Link>

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden py-4 border-t border-gray-200"
                    >
                        <div className="flex flex-col space-y-4 text-center">
                            {navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <div className="flex flex-col space-y-2">
                                <Link href="/signup">
                                    <Button variant="outline" className="w-full">
                                        Sign Up
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
}
