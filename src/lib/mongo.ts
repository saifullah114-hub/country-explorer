import mongoose from "mongoose";

let isConnected = false;

export default async function connectMongo() {
  if (isConnected) return;

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Please define MONGO_URI in .env.local");
  }

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error", err);
    throw err;
  }
}
