import { Models } from 'appwrite';

export interface KanbanBoard extends Models.Document {
    name: string;
    userId: string;
}

export interface KanbanColumn extends Models.Document {
    boardId: string;
    name: string;
    order: number; // Keep as number to match Appwrite schema
    userId: string;
}

export interface KanbanCard extends Models.Document {
    boardId: string;
    columnId: string;
    title: string;
    description?: string;
    labels?: string[];
    order: number; // Keep as number to match Appwrite schema
    dueDate?: string;
    expenseId?: string;
    userId: string;
}

export interface Expense extends Models.Document {
    title: string;
    category: string;
    amount: number;
    currency: string;
    date: string;
    description?: string;
    status: 'logged' | 'pending' | 'cleared' | 'reimbursable';
    kanbanCardId?: string;
    userId: string;
}

export interface CreateBoardData {
    name: string;
}

export interface CreateColumnData {
    boardId: string;
    name: string;
    order: number; // Keep as number for input, convert to string in service
}

export interface CreateCardData {
    boardId: string;
    columnId: string;
    title: string;
    description?: string;
    labels?: string[];
    order: number; // Keep as number for input, convert to string in service
    dueDate?: string;
    expenseId?: string;
}

export interface UpdateCardData {
    title?: string;
    description?: string;
    labels?: string[];
    dueDate?: string;
    expenseId?: string;
}

export interface MoveCardData {
    cardId: string;
    newColumnId: string;
    newOrder: number;
}

export const KANBAN_COLLECTIONS = {
    BOARDS: 'kanban_boards',
    COLUMNS: 'kanban_columns',
    CARDS: 'kanban_cards',
    EXPENSES: 'expenses'
} as const;

export const DEFAULT_COLUMNS = [
    { name: 'To Log', order: 0 },
    { name: 'Verify', order: 1 },
    { name: 'Paid', order: 2 },
    { name: 'Reimburse', order: 3 }
] as const;

export const EXPENSE_STATUS_MAP = {
    'To Log': 'logged',
    'Verify': 'pending',
    'Paid': 'cleared',
    'Reimburse': 'reimbursable'
} as const;

export const COLUMN_STATUS_MAP = {
    'logged': 'To Log',
    'pending': 'Verify',
    'cleared': 'Paid',
    'reimbursable': 'Reimburse'
} as const;
