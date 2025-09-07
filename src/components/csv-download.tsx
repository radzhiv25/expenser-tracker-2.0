"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, Calendar } from "lucide-react";
import { downloadCSV, generateCSVTemplate } from "@/lib/csv-utils";
import { Expense } from "@/lib/expense-service";
import { formatCurrency } from "@/lib/currency";

interface CSVDownloadProps {
    expenses: Expense[];
}

export function CSVDownload({ expenses }: CSVDownloadProps) {
    const [selectedFormat, setSelectedFormat] = useState<'all' | 'current-month' | 'last-month' | 'current-year'>('all');
    const [includeDescription, setIncludeDescription] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    const getFilteredExpenses = () => {
        const now = new Date();

        switch (selectedFormat) {
            case 'current-month':
                return expenses.filter(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate.getMonth() === now.getMonth() &&
                        expenseDate.getFullYear() === now.getFullYear();
                });

            case 'last-month':
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
                return expenses.filter(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate.getMonth() === lastMonth.getMonth() &&
                        expenseDate.getFullYear() === lastMonth.getFullYear();
                });

            case 'current-year':
                return expenses.filter(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate.getFullYear() === now.getFullYear();
                });

            default:
                return expenses;
        }
    };

    const getFilename = () => {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];

        switch (selectedFormat) {
            case 'current-month':
                return `expenses_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.csv`;
            case 'last-month':
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
                return `expenses_${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}.csv`;
            case 'current-year':
                return `expenses_${now.getFullYear()}.csv`;
            default:
                return `expenses_${dateStr}.csv`;
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);

        try {
            const filteredExpenses = getFilteredExpenses();

            if (filteredExpenses.length === 0) {
                alert('No expenses found for the selected period');
                return;
            }

            // Prepare expenses for CSV export
            const expensesForCSV = filteredExpenses.map(expense => ({
                ...expense,
                description: includeDescription ? expense.description : ''
            }));

            downloadCSV(expensesForCSV, getFilename());
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download CSV file');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadTemplate = () => {
        const template = generateCSVTemplate();
        const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'expenses_template.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const filteredExpenses = getFilteredExpenses();
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Expenses to CSV
                </CardTitle>
                <CardDescription>
                    Download your expenses as a CSV file for backup or analysis
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Export Options */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Time Period</label>
                        <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as "all" | "current-month" | "last-month" | "current-year")}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select time period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Expenses</SelectItem>
                                <SelectItem value="current-month">Current Month</SelectItem>
                                <SelectItem value="last-month">Last Month</SelectItem>
                                <SelectItem value="current-year">Current Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="include-description"
                            checked={includeDescription}
                            onCheckedChange={(checked) => setIncludeDescription(checked as boolean)}
                        />
                        <label htmlFor="include-description" className="text-sm font-medium">
                            Include descriptions
                        </label>
                    </div>
                </div>

                {/* Export Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Export Summary</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p>{filteredExpenses.length} expenses will be exported</p>
                        {totalAmount > 0 && (
                            <p>Total amount: {formatCurrency(totalAmount, 'USD')}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={handleDownload}
                        disabled={isDownloading || filteredExpenses.length === 0}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        {isDownloading ? 'Downloading...' : 'Download CSV'}
                    </Button>

                    <Button
                        onClick={handleDownloadTemplate}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        Download Template
                    </Button>
                </div>

                {/* Instructions */}
                <div className="text-sm text-muted-foreground space-y-2">
                    <p><strong>Export Features:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Export all expenses or filter by time period</li>
                        <li>Include or exclude expense descriptions</li>
                        <li>Download CSV template for manual data entry</li>
                        <li>Compatible with Excel, Google Sheets, and other spreadsheet applications</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
