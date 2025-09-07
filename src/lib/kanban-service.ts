import { databases, ID, Query, Permission, Role } from './appwrite';
import {
    KanbanBoard,
    KanbanColumn,
    KanbanCard,
    Expense,
    CreateBoardData,
    CreateColumnData,
    CreateCardData,
    UpdateCardData,
    MoveCardData,
    KANBAN_COLLECTIONS,
    DEFAULT_COLUMNS,
    EXPENSE_STATUS_MAP,
    COLUMN_STATUS_MAP
} from './kanban-types';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'main';

export class KanbanService {
    // Board operations
    static async createBoard(data: CreateBoardData, userId: string): Promise<KanbanBoard> {
        return await databases.createDocument(
            DB_ID,
            KANBAN_COLLECTIONS.BOARDS,
            ID.unique(),
            {
                name: data.name,
                userId
            },
            [
                Permission.read(Role.user(userId)),
                Permission.write(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        );
    }

    static async getBoards(userId: string): Promise<KanbanBoard[]> {
        const response = await databases.listDocuments(
            DB_ID,
            KANBAN_COLLECTIONS.BOARDS,
            [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
        );
        return response.documents as unknown as KanbanBoard[];
    }

    static async getBoard(boardId: string, userId: string): Promise<KanbanBoard> {
        return await databases.getDocument(
            DB_ID,
            KANBAN_COLLECTIONS.BOARDS,
            boardId
        ) as unknown as KanbanBoard;
    }

    static async deleteBoard(boardId: string, userId: string): Promise<void> {
        // Delete all cards first
        const cards = await this.getCards(boardId, userId);
        for (const card of cards) {
            await this.deleteCard(card.$id, userId);
        }

        // Delete all columns
        const columns = await this.getColumns(boardId, userId);
        for (const column of columns) {
            await databases.deleteDocument(DB_ID, KANBAN_COLLECTIONS.COLUMNS, column.$id);
        }

        // Delete the board
        await databases.deleteDocument(DB_ID, KANBAN_COLLECTIONS.BOARDS, boardId);
    }

    // Column operations
    static async createColumn(data: CreateColumnData, userId: string): Promise<KanbanColumn> {
        return await databases.createDocument(
            DB_ID,
            KANBAN_COLLECTIONS.COLUMNS,
            ID.unique(),
            {
                boardId: data.boardId,
                name: data.name,
                order: data.order, // Keep as number
                userId
            },
            [
                Permission.read(Role.user(userId)),
                Permission.write(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        );
    }

    static async getColumns(boardId: string, userId: string): Promise<KanbanColumn[]> {
        const response = await databases.listDocuments(
            DB_ID,
            KANBAN_COLLECTIONS.COLUMNS,
            [Query.equal('boardId', boardId), Query.equal('userId', userId), Query.orderAsc('order')]
        );
        return response.documents as unknown as KanbanColumn[];
    }

    static async updateColumnOrder(columnId: string, newOrder: number, userId: string): Promise<KanbanColumn> {
        return await databases.updateDocument(
            DB_ID,
            KANBAN_COLLECTIONS.COLUMNS,
            columnId,
            { order: newOrder } // Keep as number
        ) as unknown as KanbanColumn;
    }

    // Card operations
    static async createCard(data: CreateCardData, userId: string): Promise<KanbanCard> {
        return await databases.createDocument(
            DB_ID,
            KANBAN_COLLECTIONS.CARDS,
            ID.unique(),
            {
                boardId: data.boardId,
                columnId: data.columnId,
                title: data.title,
                description: data.description || '',
                labels: data.labels || [],
                order: data.order, // Keep as number
                dueDate: data.dueDate || '',
                expenseId: data.expenseId || '',
                userId
            },
            [
                Permission.read(Role.user(userId)),
                Permission.write(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        );
    }

    static async getCards(boardId: string, userId: string): Promise<KanbanCard[]> {
        const response = await databases.listDocuments(
            DB_ID,
            KANBAN_COLLECTIONS.CARDS,
            [Query.equal('boardId', boardId), Query.equal('userId', userId), Query.orderAsc('order')]
        );
        return response.documents as unknown as KanbanCard[];
    }

    static async updateCard(cardId: string, data: UpdateCardData, userId: string): Promise<KanbanCard> {
        return await databases.updateDocument(
            DB_ID,
            KANBAN_COLLECTIONS.CARDS,
            cardId,
            data
        ) as unknown as KanbanCard;
    }

    static async moveCard(data: MoveCardData, userId: string): Promise<KanbanCard> {
        const { cardId, newColumnId, newOrder } = data;

        // Get the card to update
        const card = await databases.getDocument(
            DB_ID,
            KANBAN_COLLECTIONS.CARDS,
            cardId
        ) as unknown as KanbanCard;

        const oldColumnId = card.columnId;
        const oldOrder = card.order;

        // Update the card's position
        const updatedCard = await databases.updateDocument(
            DB_ID,
            KANBAN_COLLECTIONS.CARDS,
            cardId,
            {
                columnId: newColumnId,
                order: newOrder // Keep as number
            }
        ) as unknown as KanbanCard;

        // Reindex cards in the old column
        if (oldColumnId !== newColumnId) {
            await this.reindexColumn(oldColumnId, userId);
        }

        // Reindex cards in the new column
        await this.reindexColumn(newColumnId, userId);

        // Update expense status if card is linked to an expense
        if (card.expenseId) {
            await this.updateExpenseStatusFromColumn(card.expenseId, newColumnId, userId);
        }

        return updatedCard;
    }

    static async deleteCard(cardId: string, userId: string): Promise<void> {
        const card = await databases.getDocument(
            DB_ID,
            KANBAN_COLLECTIONS.CARDS,
            cardId
        ) as unknown as KanbanCard;

        // Remove kanbanCardId from expense if linked
        if (card.expenseId) {
            await databases.updateDocument(
                DB_ID,
                KANBAN_COLLECTIONS.EXPENSES,
                card.expenseId,
                { kanbanCardId: '' }
            );
        }

        await databases.deleteDocument(DB_ID, KANBAN_COLLECTIONS.CARDS, cardId);

        // Reindex the column
        await this.reindexColumn(card.columnId, userId);
    }

    // Helper functions
    static async reindexColumn(columnId: string, userId: string): Promise<void> {
        const cards = await databases.listDocuments(
            DB_ID,
            KANBAN_COLLECTIONS.CARDS,
            [Query.equal('columnId', columnId), Query.equal('userId', userId), Query.orderAsc('order')]
        );

        // Update order for each card
        for (let i = 0; i < cards.documents.length; i++) {
            await databases.updateDocument(
                DB_ID,
                KANBAN_COLLECTIONS.CARDS,
                cards.documents[i].$id,
                { order: i } // Keep as number
            );
        }
    }

    static async updateExpenseStatusFromColumn(expenseId: string, columnId: string, userId: string): Promise<void> {
        // Get the column to determine the status
        const column = await databases.getDocument(
            DB_ID,
            KANBAN_COLLECTIONS.COLUMNS,
            columnId
        ) as unknown as KanbanColumn;

        const status = EXPENSE_STATUS_MAP[column.name as keyof typeof EXPENSE_STATUS_MAP];
        if (status) {
            await databases.updateDocument(
                DB_ID,
                KANBAN_COLLECTIONS.EXPENSES,
                expenseId,
                { status }
            );
        }
    }

    // Initialize default board and columns
    static async initializeDefaultBoard(userId: string): Promise<KanbanBoard> {
        // Create default board
        const board = await this.createBoard({ name: 'Expense Tracker' }, userId);

        // Create default columns
        for (const columnData of DEFAULT_COLUMNS) {
            await this.createColumn({
                boardId: board.$id,
                name: columnData.name,
                order: columnData.order
            }, userId);
        }

        return board;
    }

    // Get board with columns and cards
    static async getBoardWithData(boardId: string, userId: string) {
        const [board, columns, cards] = await Promise.all([
            this.getBoard(boardId, userId),
            this.getColumns(boardId, userId),
            this.getCards(boardId, userId)
        ]);

        // Group cards by column
        const columnsWithCards = columns.map(column => ({
            ...column,
            cards: cards.filter(card => card.columnId === column.$id)
        }));

        return {
            board,
            columns: columnsWithCards
        };
    }
}
