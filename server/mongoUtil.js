const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.NODE_ENV_MONGODB_URL);

module.exports = {
  connect: client.connect(),
  customersDB: client
    .db(process.env.NODE_ENV_MONGODB_DB)
    .collection("customer"),
  appointmentsDB: client
    .db(process.env.NODE_ENV_MONGODB_DB)
    .collection("appointment"),
};
