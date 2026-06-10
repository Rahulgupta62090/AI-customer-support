import mongoose from "mongoose";

const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
  throw new Error("MONGODB_URL is not defined in environment variables");
}

type MongooseCache = {
  conn: typeof mongoose.connection | null;
  promise: Promise<typeof mongoose.connection> | null;
};

let cache = global.mongoose as unknown as MongooseCache | undefined;
if (!cache) {
  cache = global.mongoose = { conn: null, promise: null } as MongooseCache;
}

const connectdb = async () => {
  if (cache!.conn) return cache!.conn;

  if (!cache!.promise) {
    cache!.promise = mongoose
      .connect(mongoUrl, {
        // keep defaults unless you need to tweak for your Mongo setup
        serverSelectionTimeoutMS: 10_000,
      })
      .then((m) => m.connection);
  }

  // Important: do NOT swallow connection errors; let the API route fail fast.
  cache!.conn = await cache!.promise;
  return cache!.conn;
};

export default connectdb;
