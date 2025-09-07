"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Filter, TrendingUp, TrendingDown, BarChart3, PieChart, LineChart, AreaChart } from "lucide-react";
import { format } from "date-fns";
import { AuthService } from "@/lib/auth";
import { ExpenseService, Expense } from "@/lib/expense-service";
import { ExpenseCharts } from "@/components/pages/ExpenseCharts";
import { CSVManager } from "@/components/csv-manager";

export default function ReportsPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
        to: new Date() // Today
    });
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        const loadExpenses = async () => {
            try {
                const currentUser = await AuthService.getCurrentUser();
                if (!currentUser) return;

                const userExpenses = await ExpenseService.getExpenses();
                setExpenses(userExpenses);
                setFilteredExpenses(userExpenses);
            } catch (err) {
                console.error('Error loading expenses:', err);
                setError('Failed to load expenses');
            } finally {
                setIsLoading(false);
            }
        };

        loadExpenses();
    }, []);

    // Filter expenses by date range
    useEffect(() => {
        if (!dateRange.from || !dateRange.to) {
            setFilteredExpenses(expenses);
            return;
        }

        const filtered = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= dateRange.from! && expenseDate <= dateRange.to!;
        });

        setFilteredExpenses(filtered);
    }, [expenses, dateRange]);

    const calculateStats = () => {
        if (filteredExpenses.length === 0) {
            return {
                totalAmount: 0,
                totalTransactions: 0,
                averageAmount: 0,
                topCategory: 'N/A',
                monthlyGrowth: 0
            };
        }

        const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalTransactions = filteredExpenses.length;
        const averageAmount = totalAmount / totalTransactions;

        // Calculate top category
        const categoryCounts = filteredExpenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topCategory = Object.entries(categoryCounts).reduce((a, b) =>
            categoryCounts[a[0]] > categoryCounts[b[0]] ? a : b
        )[0];

        // Calculate monthly growth (simplified)
        const currentMonth = new Date().getMonth();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const currentYear = new Date().getFullYear();
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const currentMonthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });

        const lastMonthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
        });

        const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        const monthlyGrowth = lastMonthTotal > 0
            ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
            : 0;

        return {
            totalAmount,
            totalTransactions,
            averageAmount,
            topCategory,
            monthlyGrowth
        };
    };

    const stats = calculateStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading reports...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                    <p className="text-muted-foreground">
                        Comprehensive insights into your spending patterns and financial trends
                    </p>
                </div>

                {/* Date Range Filter */}
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} -{" "}
                                            {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange.from}
                                selected={dateRange}
                                onSelect={(range) => setDateRange({
                                    from: range?.from,
                                    to: range?.to
                                })}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${stats.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.monthlyGrowth > 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(1)}% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                        <p className="text-xs text-muted-foreground">
                            {filteredExpenses.length} in selected period
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${stats.averageAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Per transaction
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.topCategory}</div>
                        <p className="text-xs text-muted-foreground">
                            Most frequent spending
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            {filteredExpenses.length > 0 ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Visual Analytics</h2>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Filter className="h-3 w-3" />
                            {filteredExpenses.length} expenses
                        </Badge>
                    </div>

                    <ExpenseCharts expenses={filteredExpenses} />
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {dateRange.from && dateRange.to
                                ? "No expenses found in the selected date range. Try adjusting your filters."
                                : "No expenses found. Add some expenses to see your analytics."
                            }
                        </p>
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* CSV Management */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Data Management</h2>
                    <Badge variant="secondary">Import/Export</Badge>
                </div>

                <CSVManager
                    expenses={filteredExpenses}
                    onUploadComplete={() => {
                        // Reload expenses when CSV upload completes
                        window.location.reload();
                    }}
                />
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Common reporting tasks and data management
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Button variant="outline" className="h-20 flex flex-col gap-2">
                            <Download className="h-5 w-5" />
                            <span>Export to PDF</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2">
                            <BarChart3 className="h-5 w-5" />
                            <span>Generate Report</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            <span>Schedule Report</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}