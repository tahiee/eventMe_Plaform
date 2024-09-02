import mongoose from 'mongoose';

const MONGODB_URIS = process.env.MONGODB_URI;
console.log(MONGODB_URIS, 'CONNECT');

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URIS) throw new Error('MONGODB_URI is missing');

    cached.promise = cached.promise || mongoose.connect(MONGODB_URIS, {
        dbName: 'EventMe',
        bufferCommands: false
    }).then((conn) => {
        console.log('Database connection established successfully');
        return conn;
    }).catch((error) => {
        console.error('Database connection error:', error);
        throw error;
    });

    cached.conn = await cached.promise;
    return cached.conn;
};
