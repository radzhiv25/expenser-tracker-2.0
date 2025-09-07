import { config } from 'dotenv';
import { Client, Databases, ID, Permission, Role, Query } from 'appwrite';

// Load environment variables
config({ path: '.env.local' });

const client = new Client();
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'main';

const COLLECTIONS = {
    BOARDS: 'kanban_boards',
    COLUMNS: 'kanban_columns',
    CARDS: 'kanban_cards',
    EXPENSES: 'expenses'
} as const;

const DEFAULT_COLUMNS = [
    { name: 'To Log', order: 0 },
    { name: 'Verify', order: 1 },
    { name: 'Paid', order: 2 },
    { name: 'Reimburse', order: 3 }
] as const;

async function createDatabase() {
    try {
        // Try to list documents from a collection to verify database exists
        await databases.listDocuments(DB_ID, COLLECTIONS.EXPENSES);
        console.log(`Database ${DB_ID} already exists`);
    } catch (error) {
        console.log(`Database ${DB_ID} does not exist. Please create it manually in the Appwrite console.`);
        console.log(`Database ID: ${DB_ID}`);
        console.log(`Database Name: Main Database`);
        throw new Error('Database must be created manually in Appwrite console');
    }
}

async function createCollection(name: string, attributes: any[], indexes: any[] = []) {
    try {
        // Try to list documents from the collection to verify it exists
        await databases.listDocuments(DB_ID, name);
        console.log(`Collection ${name} already exists`);
    } catch (error) {
        try {
            await databases.createCollection(DB_ID, ID.unique(), name, [
                Permission.read(Role.any()),
                Permission.write(Role.any()),
                Permission.delete(Role.any())
            ]);
            console.log(`Created collection ${name}`);

            // Add attributes
            for (const attr of attributes) {
                await databases.createStringAttribute(DB_ID, name, attr.key, attr.size, attr.required, attr.default, attr.array);
                console.log(`Added attribute ${attr.key} to ${name}`);
            }

            // Add indexes
            for (const index of indexes) {
                await databases.createIndex(DB_ID, name, index.key, index.type, index.attributes);
                console.log(`Added index ${index.key} to ${name}`);
            }
        } catch (createError) {
            console.error(`Failed to create collection ${name}:`, createError);
            throw createError;
        }
    }
}

async function seedAppwrite() {
    try {
        console.log('Starting Appwrite seeding...');

        // Create database
        await createDatabase();

        // Create collections
        await createCollection(COLLECTIONS.BOARDS, [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'userId', type: 'string', size: 255, required: true }
        ], [
            { key: 'userId', type: 'key', attributes: ['userId'] },
            { key: 'createdAt', type: 'key', attributes: ['$createdAt'] }
        ]);

        await createCollection(COLLECTIONS.COLUMNS, [
            { key: 'boardId', type: 'string', size: 255, required: true },
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'order', type: 'integer', required: true },
            { key: 'userId', type: 'string', size: 255, required: true }
        ], [
            { key: 'boardId', type: 'key', attributes: ['boardId'] },
            { key: 'userId', type: 'key', attributes: ['userId'] },
            { key: 'order', type: 'key', attributes: ['order'] }
        ]);

        await createCollection(COLLECTIONS.CARDS, [
            { key: 'boardId', type: 'string', size: 255, required: true },
            { key: 'columnId', type: 'string', size: 255, required: true },
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 1000, required: false },
            { key: 'labels', type: 'string', size: 1000, required: false, array: true },
            { key: 'order', type: 'integer', required: true },
            { key: 'dueDate', type: 'string', size: 255, required: false },
            { key: 'expenseId', type: 'string', size: 255, required: false },
            { key: 'userId', type: 'string', size: 255, required: true }
        ], [
            { key: 'boardId', type: 'key', attributes: ['boardId'] },
            { key: 'columnId', type: 'key', attributes: ['columnId'] },
            { key: 'userId', type: 'key', attributes: ['userId'] },
            { key: 'order', type: 'key', attributes: ['order'] },
            { key: 'expenseId', type: 'key', attributes: ['expenseId'] }
        ]);

        await createCollection(COLLECTIONS.EXPENSES, [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'category', type: 'string', size: 255, required: true },
            { key: 'amount', type: 'double', required: true },
            { key: 'currency', type: 'string', size: 10, required: true },
            { key: 'date', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 1000, required: false },
            { key: 'status', type: 'enum', size: 255, required: true, elements: ['logged', 'pending', 'cleared', 'reimbursable'] },
            { key: 'kanbanCardId', type: 'string', size: 255, required: false },
            { key: 'userId', type: 'string', size: 255, required: true }
        ], [
            { key: 'userId', type: 'key', attributes: ['userId'] },
            { key: 'status', type: 'key', attributes: ['status'] },
            { key: 'category', type: 'key', attributes: ['category'] },
            { key: 'date', type: 'key', attributes: ['date'] },
            { key: 'kanbanCardId', type: 'key', attributes: ['kanbanCardId'] }
        ]);

        console.log('Appwrite seeding completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Set up your Appwrite API key in .env.local');
        console.log('2. Update collection permissions to restrict access to authenticated users only');
        console.log('3. Run the application and create your first board');

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

// Run the seeding script
if (require.main === module) {
    seedAppwrite();
}

export { seedAppwrite };
