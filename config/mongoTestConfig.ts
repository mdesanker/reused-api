import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const initializeTestServer = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);

    console.log(`MongoDB connected to ${mongoUri}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
};

export default initializeTestServer;
