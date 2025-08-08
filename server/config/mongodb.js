require("dotenv").config();
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

const database = client.db(process.env.DB_NAME);
module.exports = { database };
