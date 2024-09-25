const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri);
const dbName = "todosApp";

async function connectToDatabase() {
    await client.connect();
    return client.db(dbName);
}

async function getData(collectionName) {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    return await collection.find({}).toArray();
}

async function storeData(collectionName, data) {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(data);
    return { id: result.insertedId, ...data };
}

async function updateData(collectionName, id, newData) {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: newData });
    return await collection.findOne({ _id: new ObjectId(id) });
}

async function replaceAllData(collectionName, newData) {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    await collection.deleteMany({});
    await collection.insertMany(newData);
    return newData;
}

module.exports = { connectToDatabase, storeData, getData, updateData, replaceAllData };