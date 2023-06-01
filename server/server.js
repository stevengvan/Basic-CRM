// Basic setup for packages used
// process.env.NODE_ENV = "production";
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const PORT = 3000;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NODE_ENV_CLOUDINARY_NAME,
  api_key: process.env.NODE_ENV_CLOUDINARY_API_KEY,
  api_secret: process.env.NODE_ENV_CLOUDINARY_API_SECRET,
});

// MongoDB Atlas Configuration
const client = new MongoClient(process.env.NODE_ENV_MONGODB_URL);

// Express setup
app.use(bodyParser.json({ limit: "60mb" }));
app.use(cors());
app.use(express.urlencoded({ limit: "60mb", extended: true }));
app.listen(PORT, () => console.log(`Server is live at port ${PORT}`));

// Retrieve all customer info from MongoDB
app.get("/customers/all", async (req, res) => {
  client.connect();
  let list = [];
  await client
    .db(process.env.NODE_ENV_MONGODB_DB)
    .collection("customer")
    .find()
    .forEach((element) => {
      list.push(element);
    });
  res.status(200).send(list);
});

// Create a new customer
app.post("/customers/add", async (req, res) => {
  // Add new customer to MongoDB
  client.connect();
  const DB = client.db(process.env.NODE_ENV_MONGODB_DB).collection("customer");
  const customerID = await DB.insertOne(req.body).catch((err) => {
    console.log(err);
    res.status(500).send(err);
    return;
  });

  // Upload avatar to Cloudinary
  cloudinary.uploader
    .upload(req.body.avatar, {
      public_id: String(customerID.insertedId),
    })
    .then((data) =>
      // Add image url for avatar to customer document in MongoDB
      DB.updateOne(
        { _id: new ObjectId(String(customerID.insertedId)) },
        {
          $set: { avatar: data.secure_url },
        }
      )
    )
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
      return;
    });

  res.status(200).send(`Added customer: ${customerID.insertedId}`);
});

// Apply info changes to customer in MongoDB
app.put("/customers/update", async (req, res) => {
  const customerData = req.body.data;

  client.connect();
  const DB = client.db(process.env.NODE_ENV_MONGODB_DB).collection("customer");
  await DB.updateOne(
    { _id: new ObjectId(String(customerData.id)) },
    {
      $set: {
        name: customerData.name,
        subscription: customerData.subscription,
        phone: customerData.phone,
        email: customerData.email,
      },
    }
  ).catch((err) => {
    console.log(err);
    res.status(500).send(err);
    return;
  });

  res.status(200).send("Updated customer");
});

// Delete a customer
app.delete("/customers/delete/", async (req, res) => {
  try {
    // Delete customer from MongoDB
    client.connect();
    const dbResult = await client
      .db(process.env.NODE_ENV_MONGODB_DB)
      .collection("customer")
      .deleteOne({ _id: new ObjectId(req.body.id) });
    if (dbResult.acknowledged) {
      // Delete avatar in Cloudinary
      cloudinary.uploader
        .destroy(req.body.id)
        .then(() => res.status(200).send("Deleted customer"))
        .catch((e) =>
          res
            .status(500)
            .send("Unable to delete customer avatar: ", req.body.id)
        );
    }
  } catch (e) {
    res.status(500).send("Unable to delete customer in DB: ", e);
  }
});

// Add a note to customer in MongoDB
app.put("/customers/notes/add", async (req, res) => {
  client.connect();
  await client
    .db(process.env.NODE_ENV_MONGODB_DB)
    .collection("customer")
    .updateOne(
      { _id: new ObjectId(req.body.data.id) },
      {
        $push: {
          notes: {
            $each: [
              { id: new ObjectId().toString(), text: req.body.data.note },
            ],
            $position: 0,
          },
        },
      }
    );
  return res.status(200).send("Created new note");
});

// Delete a note from a customer in MongoDB
app.put("/customers/notes/delete", async (req, res) => {
  client.connect();
  await client
    .db(process.env.NODE_ENV_MONGODB_DB)
    .collection("customer")
    .updateOne(
      { _id: new ObjectId(req.body.data.customerID) },
      { $pull: { notes: { id: req.body.data.noteID } } }
    );
  return res.status(200).send("Removed a note");
});

// Update a note from a customer in MongoDB
app.put("/customers/notes/update", async (req, res) => {
  client.connect();
  await client
    .db(process.env.NODE_ENV_MONGODB_DB)
    .collection("customer")
    .updateOne(
      {
        _id: new ObjectId(req.body.data.customerID),
        "notes.id": req.body.data.noteID,
      },
      { $set: { "notes.$.text": req.body.data.newText } }
    );
  return res.status(200).send("Removed a note");
});

// Retrieve all appointments
app.get("/appointments/all", async (req, res) => {
  let list = {};
  client.connect();
  await client
    .db(process.env.NODE_ENV_MONGODB_DB)
    .collection("appointment")
    .find()
    .forEach((element) => {
      list[element.date] = element.list;
    });
  res.status(200).send(list);
});
