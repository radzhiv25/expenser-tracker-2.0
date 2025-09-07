import { Expense } from "./expense-service";
import { formatCurrency } from "./currency";

export interface CSVExpense {
    title: string;
    category: string;
    amount: string;
    currency: string;
    date: string;
    description?: string;
}

export const CSV_HEADERS = [
    "title",
    "category",
    "amount",
    "currency",
    "date",
    "description"
];

export const REQUIRED_CSV_FIELDS = [
    "title",
    "category",
    "amount",
    "currency",
    "date"
];

export function validateCSVRow(row: CSVExpense, rowIndex: number): string[] {
    const errors: string[] = [];

    // Check required fields
    REQUIRED_CSV_FIELDS.forEach(field => {
        if (!row[field as keyof CSVExpense] || (row[field as keyof CSVExpense] as string)?.trim() === '') {
            errors.push(`Row ${rowIndex + 1}: ${field} is required`);
        }
    });

    // Validate amount
    if (row.amount) {
        const amount = parseFloat(row.amount);
        if (isNaN(amount) || amount <= 0) {
            errors.push(`Row ${rowIndex + 1}: amount must be a positive number`);
        }
    }

    // Validate date
    if (row.date) {
        const date = new Date(row.date);
        if (isNaN(date.getTime())) {
            errors.push(`Row ${rowIndex + 1}: date must be a valid date (YYYY-MM-DD format recommended)`);
        }
    }

    // Validate currency (basic check)
    if (row.currency && row.currency.length !== 3) {
        errors.push(`Row ${rowIndex + 1}: currency must be a 3-letter code (e.g., USD, EUR)`);
    }

    return errors;
}

export function parseCSV(csvText: string): CSVExpense[] {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');

    if (lines.length < 2) {
        throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    // Validate headers
    const missingHeaders = REQUIRED_CSV_FIELDS.filter(field => !headers.includes(field));
    if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    const expenses: CSVExpense[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());

        if (values.length !== headers.length) {
            errors.push(`Row ${i + 1}: incorrect number of columns`);
            continue;
        }

        const row: CSVExpense = {
            title: values[headers.indexOf('title')] || '',
            category: values[headers.indexOf('category')] || '',
            amount: values[headers.indexOf('amount')] || '',
            currency: values[headers.indexOf('currency')] || '',
            date: values[headers.indexOf('date')] || '',
            description: values[headers.indexOf('description')] || ''
        };

        const rowErrors = validateCSVRow(row, i);
        errors.push(...rowErrors);

        if (rowErrors.length === 0) {
            expenses.push(row);
        }
    }

    if (errors.length > 0) {
        throw new Error(`CSV validation errors:\n${errors.join('\n')}`);
    }

    return expenses;
}

export function convertToExpense(csvExpense: CSVExpense, userId: string): Omit<Expense, '$id' | '$createdAt' | '$updatedAt'> {
    return {
        title: csvExpense.title.trim(),
        category: csvExpense.category.trim(),
        amount: parseFloat(csvExpense.amount),
        currency: csvExpense.currency.trim().toUpperCase(),
        date: new Date(csvExpense.date).toISOString().split('T')[0],
        description: csvExpense.description?.trim() || '',
        userId,
        status: 'logged' as const
    };
}

export function convertToCSV(expenses: Expense[]): string {
    const headers = CSV_HEADERS.join(',');
    const rows = expenses.map(expense => [
        `"${expense.title}"`,
        `"${expense.category}"`,
        expense.amount.toString(),
        expense.currency,
        expense.date,
        `"${expense.description || ''}"`
    ].join(','));

    return [headers, ...rows].join('\n');
}

export function downloadCSV(expenses: Expense[], filename: string = 'expenses.csv') {
    const csvContent = convertToCSV(expenses);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export function generateCSVTemplate(): string {
    const headers = CSV_HEADERS.join(',');
    const sampleRow = [
        '"Sample Expense"',
        '"Food & Dining"',
        '25.50',
        'USD',
        '2024-01-15',
        '"Lunch at restaurant"'
    ].join(',');

    return [headers, sampleRow].join('\n');
}
