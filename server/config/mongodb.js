require("dotenv").config();
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

const database = client.db("my-social-media-app");
module.exports = { database };
