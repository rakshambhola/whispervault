// Quick test to check MongoDB connection
import { connectDB } from './lib/db/mongodb.js';
import { ConfessionModel } from './lib/models/Confession.js';

async function test() {
    try {
        console.log('Testing MongoDB connection...');
        await connectDB();

        console.log('Fetching confessions...');
        const confessions = await ConfessionModel.find().lean();

        console.log(`Found ${confessions.length} confessions:`);
        confessions.forEach(c => {
            console.log(`- ${c.id}: ${c.content.substring(0, 50)}...`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

test();
