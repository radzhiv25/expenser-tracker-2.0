import { config } from 'dotenv';
import { Client, Databases } from 'appwrite';

// Load environment variables
config({ path: '.env.local' });

const client = new Client();
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

async function testAppwrite() {
    try {
        console.log('Testing Appwrite connection...');
        console.log(`Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`);
        console.log(`Project ID: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`);

        // List available methods
        console.log('\nAvailable methods on databases:');
        console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(databases)));

        // Try to list databases
        try {
            const result = await databases.list();
            console.log('\n✅ Successfully connected to Appwrite!');
            console.log(`Found ${result.total} databases:`);
            result.databases.forEach(db => {
                console.log(`  - ${db.name} (${db.$id})`);
            });
        } catch (error) {
            console.log('\n❌ Error listing databases:', error.message);
        }

    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

testAppwrite();



