import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cashed = global.mongoose;

if (!cashed) {
  cashed = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if (cashed.conn) {
        return cashed.conn;
    }

    if (!cashed.promise) {
        cashed.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            console.log("connectd to mongodb");
            return mongoose;
        });
    }

    cashed.conn = await cashed.promise;
    return cashed.conn;
}

