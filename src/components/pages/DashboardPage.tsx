"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, CalendarIcon, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@/lib/auth";
import { ExpenseService, Expense } from "@/lib/expense-service";
import { CURRENCY_OPTIONS, formatCurrency, getCurrencySymbol, DEFAULT_CURRENCY } from "@/lib/currency";
import { CSVManager } from "../csv-manager";

const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Travel",
    "Education",
    "Other"
];

export function DashboardPage() {
    const router = useRouter();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        currency: DEFAULT_CURRENCY,
        category: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
    });

    // Function to load expenses
    const loadExpenses = async () => {
        try {
            const userExpenses = await ExpenseService.getExpenses();
            setExpenses(userExpenses);
        } catch (error) {
            console.error('Error loading expenses:', error);
            setError('Failed to load expenses');
        }
    };

    // Check if user is logged in and load expenses
    useEffect(() => {
        const checkAuthAndLoadData = async () => {
            try {
                const isLoggedIn = await AuthService.isLoggedIn();
                if (!isLoggedIn) {
                    router.push('/login');
                    return;
                }

                await loadExpenses();
            } catch (error) {
                console.error('Error loading data:', error);
                setError('Failed to load expenses');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthAndLoadData();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.amount || !formData.category) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            const expenseData = {
                title: formData.title,
                amount: parseFloat(formData.amount),
                currency: formData.currency,
                category: formData.category,
                description: formData.description,
                date: formData.date,
                status: 'logged' as const,
                userId: "" // Will be set by the service
            };

            if (editingExpense) {
                const updatedExpense = await ExpenseService.updateExpense(editingExpense.$id!, expenseData);
                setExpenses(expenses.map(exp => exp.$id === editingExpense.$id ? updatedExpense : exp));
            } else {
                const newExpense = await ExpenseService.createExpense(expenseData);
                setExpenses([newExpense, ...expenses]);
            }

            resetForm();
            setIsDialogOpen(false);
            setError(null);
        } catch (error) {
            console.error('Error saving expense:', error);
            setError('Failed to save expense');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setFormData({
            title: expense.title,
            amount: expense.amount.toString(),
            currency: expense.currency,
            category: expense.category,
            description: expense.description,
            date: expense.date
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (expenseId: string) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            try {
                setIsDeleting(true);
                setError(null);
                await ExpenseService.deleteExpense(expenseId);
                setExpenses(expenses.filter(exp => exp.$id !== expenseId));
                setError(null);
            } catch (error) {
                console.error('Error deleting expense:', error);
                setError('Failed to delete expense');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            amount: "",
            currency: DEFAULT_CURRENCY,
            category: "",
            description: "",
            date: new Date().toISOString().split('T')[0]
        });
        setEditingExpense(null);
    };

    // Calculate totals by currency
    const expensesByCurrency = expenses.reduce((acc, expense) => {
        if (!acc[expense.currency]) {
            acc[expense.currency] = 0;
        }
        acc[expense.currency] += expense.amount;
        return acc;
    }, {} as Record<string, number>);

    const thisMonthExpensesByCurrency = expenses
        .filter(expense => {
            const expenseDate = new Date(expense.date);
            const now = new Date();
            return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
        })
        .reduce((acc, expense) => {
            if (!acc[expense.currency]) {
                acc[expense.currency] = 0;
            }
            acc[expense.currency] += expense.amount;
            return acc;
        }, {} as Record<string, number>);

    const categoryTotals = categories.map(category => {
        const categoryExpenses = expenses.filter(expense => expense.category === category);
        const totalsByCurrency = categoryExpenses.reduce((acc, expense) => {
            if (!acc[expense.currency]) {
                acc[expense.currency] = 0;
            }
            acc[expense.currency] += expense.amount;
            return acc;
        }, {} as Record<string, number>);

        return {
            category,
            totalsByCurrency,
            totalExpenses: categoryExpenses.length
        };
    }).filter(item => item.totalExpenses > 0);

    return (
        <div className="w-5/6 mx-auto py-5">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
                <p className="text-gray-600">Track and manage your expenses efficiently</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your expenses...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    {Object.entries(expensesByCurrency).map(([currency, amount]) => (
                                        <div key={currency} className="text-lg font-bold">
                                            {formatCurrency(amount, currency)}
                                        </div>
                                    ))}
                                    {Object.keys(expensesByCurrency).length === 0 && (
                                        <div className="text-lg font-bold text-muted-foreground">{formatCurrency(0, DEFAULT_CURRENCY)}</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    {Object.entries(thisMonthExpensesByCurrency).map(([currency, amount]) => (
                                        <div key={currency} className="text-lg font-bold">
                                            {formatCurrency(amount, currency)}
                                        </div>
                                    ))}
                                    {Object.keys(thisMonthExpensesByCurrency).length === 0 && (
                                        <div className="text-lg font-bold text-muted-foreground">{formatCurrency(0, DEFAULT_CURRENCY)}</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{expenses.length}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Analytics CTA */}
                    {expenses.length > 0 && (
                        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <BarChart3 className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-900">View Detailed Analytics</h3>
                                            <p className="text-blue-700 text-sm">
                                                Explore interactive charts, spending patterns, and comprehensive reports
                                            </p>
                                        </div>
                                    </div>
                                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                        <Link href="/reports">
                                            <BarChart3 className="h-4 w-4 mr-2" />
                                            View Reports
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* CSV Manager */}
                    <CSVManager expenses={expenses} onUploadComplete={loadExpenses} />

                    {/* Add Expense Button */}
                    <div className="my-6">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={resetForm}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Expense
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] p-6">
                                <DialogHeader className="pb-4">
                                    <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
                                    <DialogDescription>
                                        {editingExpense ? 'Update the expense details below.' : 'Enter the details of your new expense.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter expense title"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Amount *</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                step="0.01"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                placeholder="0.00"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="currency">Currency *</Label>
                                            <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select currency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {CURRENCY_OPTIONS.map((currency) => (
                                                        <SelectItem key={currency.code} value={currency.code}>
                                                            <div className="flex items-center space-x-2">
                                                                <span>{currency.flag}</span>
                                                                <span>{currency.symbol} {currency.name}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category *</Label>
                                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date *</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {formData.date ? new Date(formData.date).toLocaleDateString() : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.date ? new Date(formData.date) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setFormData({ ...formData, date: date.toISOString().split('T')[0] });
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Enter expense description (optional)"
                                            className="w-full min-h-[80px]"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    {editingExpense ? 'Updating...' : 'Adding...'}
                                                </>
                                            ) : (
                                                `${editingExpense ? 'Update' : 'Add'} Expense`
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Expenses Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Expenses</CardTitle>
                            <CardDescription>A list of your recent expenses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {expenses.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No expenses yet. Add your first expense to get started!
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Currency</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {expenses
                                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                            .map((expense) => (
                                                <TableRow key={expense.$id}>
                                                    <TableCell className="font-medium">{expense.title}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{expense.category}</Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {formatCurrency(expense.amount, expense.currency)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-1">
                                                            <span>{getCurrencySymbol(expense.currency)}</span>
                                                            <span className="text-sm text-muted-foreground">{expense.currency}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEdit(expense)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDelete(expense.$id!)}
                                                                disabled={isDeleting}
                                                            >
                                                                {isDeleting ? (
                                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                                                                ) : (
                                                                    <Trash2 className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Category Breakdown */}
                    {categoryTotals.length > 0 && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Expenses by Category</CardTitle>
                                <CardDescription>Breakdown of your expenses by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {categoryTotals.map((item) => (
                                        <div key={item.category} className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">{item.category}</span>
                                                <span className="text-xs text-muted-foreground">{item.totalExpenses} expense{item.totalExpenses !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="space-y-1">
                                                {Object.entries(item.totalsByCurrency).map(([currency, amount]) => (
                                                    <div key={currency} className="flex justify-between items-center ml-2">
                                                        <span className="text-xs text-muted-foreground">{currency}</span>
                                                        <span className="text-sm font-bold">{formatCurrency(amount, currency)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
