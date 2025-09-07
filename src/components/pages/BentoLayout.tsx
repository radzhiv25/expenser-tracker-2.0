"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { TrendingUp, Shield, BarChart3, Smartphone, Zap, Users } from "lucide-react";

interface BentoLayoutProps {
    className?: string;
}

const stats = [
    { label: "Users", value: "10K+", icon: <Users className="h-5 w-5" /> },
    { label: "Expenses Tracked", value: "1M+", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Money Saved", value: "$500K+", icon: <BarChart3 className="h-5 w-5" /> },
];

const features = [
    {
        title: "Smart Analytics",
        description: "Get insights into your spending patterns with AI-powered analytics",
        icon: <BarChart3 className="h-6 w-6" />,
        color: "bg-blue-500",
    },
    {
        title: "Secure & Private",
        description: "Bank-level security keeps your financial data safe",
        icon: <Shield className="h-6 w-6" />,
        color: "bg-green-500",
    },
    {
        title: "Mobile First",
        description: "Track expenses on the go with our intuitive mobile app",
        icon: <Smartphone className="h-6 w-6" />,
        color: "bg-purple-500",
    },
    {
        title: "Lightning Fast",
        description: "Quick expense entry with smart categorization",
        icon: <Zap className="h-6 w-6" />,
        color: "bg-orange-500",
    },
];

const carouselItems = [
    <div key="1" className="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 p-8 rounded-2xl text-white h-72 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-50">
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
        </div>
        <div className="text-center relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-3xl font-bold mb-3">Track Every Expense</h3>
            <p className="text-blue-100 text-lg">Never miss a transaction with our smart tracking</p>
        </div>
    </div>,
    <div key="2" className="bg-gradient-to-br from-green-500 via-teal-600 to-emerald-700 p-8 rounded-2xl text-white h-72 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-50">
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
        </div>
        <div className="text-center relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-3xl font-bold mb-3">Visual Reports</h3>
            <p className="text-green-100 text-lg">Beautiful charts and insights at your fingertips</p>
        </div>
    </div>,
    <div key="3" className="bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 p-8 rounded-2xl text-white h-72 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-50">
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
        </div>
        <div className="text-center relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-3xl font-bold mb-3">Budget Goals</h3>
            <p className="text-orange-100 text-lg">Set and achieve your financial goals</p>
        </div>
    </div>,
];

export function BentoLayout({ className = "" }: BentoLayoutProps) {
    return (
        <section className={`py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden ${className}`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 text-sm font-medium text-gray-700 mb-6 shadow-lg"
                    >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        All-in-one solution
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Everything You Need to
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Manage Your Money</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Powerful features designed to help you take control of your finances and build better money habits.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <Card className="h-full bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">📊</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Trusted by Thousands</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    {stats.map((stat, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                            viewport={{ once: true }}
                                            className="text-center group-hover:scale-105 transition-transform duration-300"
                                        >
                                            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 rounded-2xl mb-4 shadow-lg">
                                                {stat.icon}
                                            </div>
                                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Carousel */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <Card className="h-full bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">🎬</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">See It In Action</h3>
                                </div>
                                <Carousel items={carouselItems} className="h-72 rounded-2xl overflow-hidden" />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Feature Cards */}
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-105">
                                <CardContent className="p-6">
                                    <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.color} text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                        <CardContent className="p-12">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.9 }}
                                viewport={{ once: true }}
                                className="max-w-4xl mx-auto"
                            >
                                <h3 className="text-3xl md:text-4xl font-bold mb-6 group-hover:scale-105 transition-transform duration-300">
                                    Ready to Transform Your Finances?
                                </h3>
                                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                                    Join thousands of users who are already taking control of their financial future with Finboard.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href="/signup"
                                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
                                    >
                                        Start Free Trial
                                    </a>
                                    <a
                                        href="/login"
                                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
                                    >
                                        Sign In
                                    </a>
                                </div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
