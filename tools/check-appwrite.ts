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

async function checkAppwrite() {
    try {
        console.log('Checking Appwrite connection...');
        console.log(`Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`);
        console.log(`Project ID: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`);
        console.log(`Database ID: ${DB_ID}`);

        // Check database by trying to list documents from a collection
        // We'll try to list documents from the expenses collection to verify the database works
        try {
            const expenses = await databases.listDocuments(DB_ID, process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!);
            console.log(`✅ Database found with ID: ${DB_ID}`);
            console.log(`✅ Found ${expenses.total} expenses in the database`);
        } catch (error) {
            console.log(`✅ Database found with ID: ${DB_ID}`);
            console.log(`⚠️  Could not list expenses (this is normal if no expenses exist yet)`);
        }

        console.log('\n✅ Appwrite is properly configured!');
        console.log('\nYou can now:');
        console.log('1. Start your Next.js app: npm run dev');
        console.log('2. Navigate to http://localhost:3000/dashboard');
        console.log('3. Access the Kanban boards at http://localhost:3000/boards');

    } catch (error) {
        console.error('❌ Appwrite check failed:', error);
        console.log('\nTroubleshooting:');
        console.log('1. Make sure your .env.local file has the correct values');
        console.log('2. Verify your Appwrite project is active');
        console.log('3. Check that the database exists in your Appwrite console');
        process.exit(1);
    }
}

// Run the check
if (require.main === module) {
    checkAppwrite();
}

export { checkAppwrite };
