import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

let isConnected = false // global connection state

export async function connectToDatabase() {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME // optional if included in URI
    })
    isConnected = true
    console.log("✅ MongoDB connected")
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    throw error
  }
}
