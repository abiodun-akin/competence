import { MongoClient } from 'mongodb';

let db = null;
let client = null;

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log('No MongoDB URI found, using in-memory data');
      return null;
    }

    client = new MongoClient(uri);
    await client.connect();
    db = client.db('competence');
    console.log('✓ Connected to MongoDB Atlas');
    return db;
  } catch (error) {
    console.log('MongoDB connection failed, using in-memory data:', error.message);
    return null;
  }
};

export const getDB = () => db;

export const closeDB = async () => {
  if (client) {
    await client.close();
  }
};