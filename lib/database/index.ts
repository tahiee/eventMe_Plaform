import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI, 'CONNECT');

// Define the type for the cached object
interface MongooseCache {
    conn: Connection | null;
    promise: Promise<Connection> | null;
}

// Initialize the cached object
let cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async (): Promise<Connection> => {
    // Return the cached connection if it exists
    if (cached.conn) return cached.conn;

    // Ensure the URI is provided
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is missing');
    }

    // Create a new connection promise if it doesn't already exist
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: 'EventMe',
            bufferCommands: false,
        }).then((mongooseInstance) => {
            console.log('Database connection established successfully');
            return mongooseInstance.connection;
        }).catch((error) => {
            console.error('Database connection error:', error);
            throw error;
        });
    }

    // Cache and return the connection
    cached.conn = await cached.promise;
    return cached.conn;
};
