const { MongoClient } = require("mongodb");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const client = new MongoClient(process.env.NODE_ENV_MONGODB_URL);

module.exports = {
  client: client,
  customersDB: client
    .db(process.env.NODE_ENV_MONGODB_DB)
    .collection("customer"),
  appointmentsDB: client
    .db(process.env.NODE_ENV_MONGODB_DB)
    .collection("appointment"),
};
