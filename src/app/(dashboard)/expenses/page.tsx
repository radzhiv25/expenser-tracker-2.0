"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Link as LinkIcon, Receipt } from "lucide-react";
import { AuthService } from "@/lib/auth";
import { ExpenseService } from "@/lib/expense-service";
import { KanbanService } from "@/lib/kanban-service";
import { Expense } from "@/lib/expense-service";
import { KanbanBoard } from "@/lib/kanban-types";
import { formatCurrency } from "@/lib/currency";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ $id: string; name: string; email: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [boards, setBoards] = useState<KanbanBoard[]>([]);
    const [selectedBoardId, setSelectedBoardId] = useState<string>("");
    const [isCreatingExpense, setIsCreatingExpense] = useState(false);
    const [isUpdatingExpense, setIsUpdatingExpense] = useState(false);
    const [isDeletingExpense, setIsDeletingExpense] = useState(false);
    const [isLinkingToKanban, setIsLinkingToKanban] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        currency: 'USD',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        status: 'logged'
    });
    const router = useRouter();

    const categories = [
        "Food & Dining",
        "Transportation",
        "Shopping",
        "Bills & Utilities",
        "Entertainment",
        "Healthcare",
        "Travel",
        "Other"
    ];

    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "logged", label: "Logged" },
        { value: "pending", label: "Pending" },
        { value: "cleared", label: "Cleared" },
        { value: "reimbursable", label: "Reimbursable" }
    ];

    const loadExpenses = useCallback(async () => {
        try {
            const userExpenses = await ExpenseService.getExpenses();
            setExpenses(userExpenses);
        } catch (err) {
            console.error('Error loading expenses:', err);
            setError('Failed to load expenses');
        }
    }, []);

    const loadBoards = useCallback(async () => {
        if (!user) return;

        try {
            const userBoards = await KanbanService.getBoards(user.$id);
            setBoards(userBoards);
            if (userBoards.length > 0) {
                setSelectedBoardId(userBoards[0].$id);
            }
        } catch (err) {
            console.error('Error loading boards:', err);
            setError('Failed to load boards');
        }
    }, [user]);

    useEffect(() => {
        const checkAuthAndLoadExpenses = async () => {
            try {
                const currentUser = await AuthService.getCurrentUser();
                if (!currentUser) {
                    router.push('/login');
                    return;
                }

                setUser(currentUser);
                await loadExpenses();
                await loadBoards();
            } catch (err) {
                console.error('Error loading expenses:', err);
                setError('Failed to load expenses');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthAndLoadExpenses();
    }, [router, loadExpenses, loadBoards]);

    const resetForm = () => {
        setFormData({
            title: '',
            amount: '',
            currency: 'USD',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            status: 'logged'
        });
    };

    const handleCreateExpense = async () => {
        if (!user) return;

        try {
            setIsCreatingExpense(true);
            setError(null);
            console.log('Creating expense with data:', formData);

            const expenseData = {
                title: formData.title,
                amount: parseFloat(formData.amount),
                currency: formData.currency,
                category: formData.category,
                description: formData.description,
                date: formData.date,
                status: formData.status as 'logged' | 'pending' | 'cleared' | 'reimbursable'
            };

            console.log('Expense data to create:', expenseData);

            const createdExpense = await ExpenseService.createExpense(expenseData);
            console.log('Created expense:', createdExpense);

            await loadExpenses();
            setIsCreateDialogOpen(false);
            resetForm();
        } catch (err) {
            console.error('Failed to create expense:', err);
            setError(`Failed to create expense: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsCreatingExpense(false);
        }
    };

    const handleEditExpense = async () => {
        if (!editingExpense) return;

        try {
            setIsUpdatingExpense(true);
            setError(null);
            await ExpenseService.updateExpense(editingExpense.$id!, {
                title: formData.title,
                amount: parseFloat(formData.amount),
                currency: formData.currency,
                category: formData.category,
                description: formData.description,
                date: formData.date,
                status: formData.status as 'logged' | 'pending' | 'cleared' | 'reimbursable'
            });

            await loadExpenses();
            setIsEditDialogOpen(false);
            setEditingExpense(null);
            resetForm();
        } catch (err) {
            console.error('Failed to update expense:', err);
            setError('Failed to update expense');
        } finally {
            setIsUpdatingExpense(false);
        }
    };

    const handleDeleteExpense = async (expenseId: string) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;

        try {
            setIsDeletingExpense(true);
            setError(null);
            await ExpenseService.deleteExpense(expenseId);
            await loadExpenses();
        } catch (err) {
            console.error('Failed to delete expense:', err);
            setError('Failed to delete expense');
        } finally {
            setIsDeletingExpense(false);
        }
    };

    const openEditDialog = (expense: Expense) => {
        setEditingExpense(expense);
        setFormData({
            title: expense.title,
            amount: expense.amount.toString(),
            currency: expense.currency,
            category: expense.category,
            description: expense.description || '',
            date: expense.date,
            status: expense.status
        });
        setIsEditDialogOpen(true);
    };

    const handleCreateKanbanCard = async (expense: Expense) => {
        if (!user || !selectedBoardId) {
            setError("Please select a board to create the card");
            return;
        }

        try {
            setIsLinkingToKanban(true);
            setError(null);
            console.log('Creating Kanban card for expense:', expense);
            console.log('User ID:', user.$id);
            console.log('Selected Board ID:', selectedBoardId);

            // Get the selected board
            const board = boards.find(b => b.$id === selectedBoardId);
            if (!board) {
                throw new Error('Selected board not found');
            }

            console.log('Using selected board:', board);

            // Check if this board has columns, if not create them
            const existingColumns = await KanbanService.getColumns(board.$id, user.$id);
            if (existingColumns.length === 0) {
                console.log('Board has no columns, creating default columns...');
                const defaultColumns = [
                    { name: 'To Log', order: 0 },
                    { name: 'Verify', order: 1 },
                    { name: 'Paid', order: 2 },
                    { name: 'Reimburse', order: 3 }
                ];

                for (const columnData of defaultColumns) {
                    await KanbanService.createColumn({
                        boardId: board.$id,
                        name: columnData.name,
                        order: columnData.order
                    }, user.$id);
                }
                console.log('Created default columns for existing board');
            }

            // Get columns for the board
            let columns = await KanbanService.getColumns(board.$id, user.$id);
            console.log('Found columns:', columns);

            // If no columns exist, create default columns
            if (columns.length === 0) {
                console.log('No columns found, creating default columns...');
                const defaultColumns = [
                    { name: 'To Log', order: 0 },
                    { name: 'Verify', order: 1 },
                    { name: 'Paid', order: 2 },
                    { name: 'Reimburse', order: 3 }
                ];

                for (const columnData of defaultColumns) {
                    await KanbanService.createColumn({
                        boardId: board.$id,
                        name: columnData.name,
                        order: columnData.order
                    }, user.$id);
                }

                // Reload columns
                columns = await KanbanService.getColumns(board.$id, user.$id);
                console.log('Created default columns:', columns);
            }

            // Find the appropriate column based on expense status
            const statusToColumn = {
                'logged': 'To Log',
                'pending': 'Verify',
                'cleared': 'Paid',
                'reimbursable': 'Reimburse'
            };

            const targetColumnName = statusToColumn[expense.status as keyof typeof statusToColumn] || 'To Log';
            const targetColumn = columns.find(col => col.name === targetColumnName);

            console.log('Target column name:', targetColumnName);
            console.log('Target column:', targetColumn);
            console.log('Available columns:', columns.map(c => c.name));

            if (!targetColumn) {
                throw new Error(`Target column '${targetColumnName}' not found. Available columns: ${columns.map(c => c.name).join(', ')}`);
            }

            // Create the card
            console.log('Creating card with data:', {
                boardId: board.$id,
                columnId: targetColumn.$id,
                title: expense.title,
                description: expense.description || '',
                order: 0,
                expenseId: expense.$id
            });

            const card = await KanbanService.createCard({
                boardId: board.$id,
                columnId: targetColumn.$id,
                title: expense.title,
                description: expense.description || '',
                order: 0, // Will be reindexed
                expenseId: expense.$id
            }, user.$id);

            console.log('Created card:', card);

            // Update the expense with the kanban card reference
            if (expense.$id) {
                await ExpenseService.updateExpense(expense.$id, {
                    ...expense,
                    kanbanCardId: card.$id
                });
            }

            console.log('Updated expense with card ID');

            // Reload expenses
            await loadExpenses();
            setIsLinkDialogOpen(false);
            console.log('Successfully created Kanban card');
        } catch (err) {
            console.error('Failed to create Kanban card:', err);
            setError(`Failed to create Kanban card: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsLinkingToKanban(false);
        }
    };

    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'logged': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cleared': return 'bg-green-100 text-green-800';
            case 'reimbursable': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading expenses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={loadExpenses}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Expenses</h1>
                    <p className="text-muted-foreground">
                        Manage your expenses and link them to Kanban boards
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search expenses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Category</label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                    setCategoryFilter("all");
                                }}
                                className="w-full"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Expenses Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Expenses ({filteredExpenses.length})</CardTitle>
                    <CardDescription>
                        Current month expenses with Kanban integration
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredExpenses.length === 0 ? (
                        <div className="text-center py-8">
                            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                                    ? "Try adjusting your filters"
                                    : "Add your first expense to get started"
                                }
                            </p>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Expense
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Kanban</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredExpenses.map((expense) => (
                                    <TableRow key={expense.$id}>
                                        <TableCell className="font-medium">{expense.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{expense.category}</Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatCurrency(expense.amount, expense.currency)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(expense.status)}>
                                                {expense.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(expense.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {expense.kanbanCardId ? (
                                                <Badge variant="outline" className="text-green-600">
                                                    <LinkIcon className="h-3 w-3 mr-1" />
                                                    Linked
                                                </Badge>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedExpense(expense);
                                                        setIsLinkDialogOpen(true);
                                                    }}
                                                >
                                                    <LinkIcon className="h-3 w-3 mr-1" />
                                                    Link
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditDialog(expense)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteExpense(expense.$id!)}
                                                    disabled={isDeletingExpense}
                                                >
                                                    {isDeletingExpense ? (
                                                        <>
                                                            <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        'Delete'
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

            {/* Create Expense Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Expense</DialogTitle>
                        <DialogDescription>
                            Create a new expense entry
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Title *</label>
                                <Input
                                    placeholder="Expense title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Category *</label>
                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
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
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Amount *</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Currency</label>
                                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                        <SelectItem value="INR">INR</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Date *</label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Description</label>
                            <Input
                                placeholder="Optional description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="logged">Logged</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="cleared">Cleared</SelectItem>
                                    <SelectItem value="reimbursable">Reimbursable</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => {
                                setIsCreateDialogOpen(false);
                                resetForm();
                            }}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateExpense} disabled={isCreatingExpense}>
                                {isCreatingExpense ? (
                                    <>
                                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Expense
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Expense Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                        <DialogDescription>
                            Update expense details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Title *</label>
                                <Input
                                    placeholder="Expense title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Category *</label>
                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
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
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Amount *</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Currency</label>
                                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                        <SelectItem value="INR">INR</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Date *</label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Description</label>
                            <Input
                                placeholder="Optional description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="logged">Logged</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="cleared">Cleared</SelectItem>
                                    <SelectItem value="reimbursable">Reimbursable</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => {
                                setIsEditDialogOpen(false);
                                setEditingExpense(null);
                                resetForm();
                            }}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditExpense} disabled={isUpdatingExpense}>
                                {isUpdatingExpense ? (
                                    <>
                                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Expense'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Link to Kanban Dialog */}
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Link to Kanban Board</DialogTitle>
                        <DialogDescription>
                            Create a Kanban card for this expense
                        </DialogDescription>
                    </DialogHeader>
                    {selectedExpense && (
                        <div className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium">{selectedExpense.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                    {formatCurrency(selectedExpense.amount, selectedExpense.currency)} • {selectedExpense.category}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Status: {selectedExpense.status}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Select Board</label>
                                <Select value={selectedBoardId} onValueChange={setSelectedBoardId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a board" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {boards.map((board) => (
                                            <SelectItem key={board.$id} value={board.$id}>
                                                {board.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => handleCreateKanbanCard(selectedExpense)}
                                    disabled={!selectedBoardId || isLinkingToKanban}
                                >
                                    {isLinkingToKanban ? (
                                        <>
                                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Creating Card...
                                        </>
                                    ) : (
                                        <>
                                            <LinkIcon className="h-4 w-4 mr-2" />
                                            Create Card
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
