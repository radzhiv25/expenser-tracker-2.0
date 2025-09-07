import { databases, ID, Query } from './appwrite';
import { AuthService } from './auth';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

// Debug logging to help identify configuration issues
console.log('Appwrite Config:', {
    DATABASE_ID,
    COLLECTION_ID,
    hasDatabaseId: !!DATABASE_ID,
    hasCollectionId: !!COLLECTION_ID
});

// Validate environment variables
if (!DATABASE_ID) {
    throw new Error('NEXT_PUBLIC_APPWRITE_DB_ID is not defined in environment variables');
}

if (!COLLECTION_ID) {
    throw new Error('NEXT_PUBLIC_APPWRITE_COLLECTION_ID is not defined in environment variables');
}

export interface Expense {
    $id?: string;
    title: string;
    amount: number;
    currency: string;
    category: string;
    description: string;
    date: string;
    status: 'logged' | 'pending' | 'cleared' | 'reimbursable';
    kanbanCardId?: string;
    userId: string;
    $createdAt?: string;
    $updatedAt?: string;
}

export class ExpenseService {
    // Get all expenses for the current user
    static async getExpenses(): Promise<Expense[]> {
        try {
            const user = await AuthService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.equal('userId', user.$id), Query.orderDesc('$createdAt')]
            );

            return response.documents as unknown as Expense[];
        } catch (error) {
            console.error('Error fetching expenses:', error);
            throw error;
        }
    }

    // Create a new expense
    static async createExpense(expense: Omit<Expense, '$id' | 'userId' | '$createdAt' | '$updatedAt'>): Promise<Expense> {
        try {
            const user = await AuthService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            console.log('Creating expense with:', {
                DATABASE_ID,
                COLLECTION_ID,
                expense,
                userId: user.$id
            });

            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    ...expense,
                    userId: user.$id,
                }
            );

            return response as unknown as Expense;
        } catch (error) {
            console.error('Error creating expense:', error);
            console.error('Environment check:', {
                DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                COLLECTION_ID: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID
            });
            throw error;
        }
    }

    // Update an expense
    static async updateExpense(expenseId: string, expense: Partial<Expense>): Promise<Expense> {
        try {
            const user = await AuthService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                expenseId,
                expense
            );

            return response as unknown as Expense;
        } catch (error) {
            console.error('Error updating expense:', error);
            throw error;
        }
    }

    // Delete an expense
    static async deleteExpense(expenseId: string): Promise<void> {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, expenseId);
        } catch (error) {
            console.error('Error deleting expense:', error);
            throw error;
        }
    }

    // Get expenses by category
    static async getExpensesByCategory(category: string): Promise<Expense[]> {
        try {
            const user = await AuthService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.equal('category', category),
                    Query.orderDesc('$createdAt')
                ]
            );

            return response.documents as unknown as Expense[];
        } catch (error) {
            console.error('Error fetching expenses by category:', error);
            throw error;
        }
    }

    // Get expenses by date range
    static async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
        try {
            const user = await AuthService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.greaterThanEqual('date', startDate),
                    Query.lessThanEqual('date', endDate),
                    Query.orderDesc('$createdAt')
                ]
            );

            return response.documents as unknown as Expense[];
        } catch (error) {
            console.error('Error fetching expenses by date range:', error);
            throw error;
        }
    }
}

