import mongoose from 'mongoose'

const MONGOBD_URIS = process.env.MONGODB_URI

let cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async () => {
    if (cached.conn)
        return cached.conn
    if (!MONGOBD_URIS) throw Error('MONGODB_URI is missing')

    cached.promise = cached.promise || mongoose.connect(MONGOBD_URIS, {
        dbName: 'EventMe',
        bufferCommands: false
    })
    cached.conn = await cached.process
    return cached.conn
}
