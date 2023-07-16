const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const cloudinary = require("../cloudinaryUtil");
const mongoUtil = require("../mongoUtil");
const customersDB = mongoUtil.customersDB;

// Retrieve all customers info from MongoDB
router.get("/all", async (req, res) => {
  const list = await customersDB.find().toArray();

  return res.status(200).send(list);
});

// Retrieve a customer info from MongoDB
router.get("/:id", async (req, res) => {
  const customer = await customersDB.findOne({
    _id: new ObjectId(String(req.params.id)),
  });
  return res.status(200).send(customer);
});

// Create a new customer
router.post("/add", async (req, res) => {
  // Add new customer to MongoDB

  const customerID = await customersDB.insertOne(req.body).catch((err) => {
    return res.status(500).send("Error adding customer at mongoDB:\n", err);
  });

  // Upload avatar to Cloudinary
  cloudinary.uploader
    .upload(req.body.avatar, {
      public_id: String(customerID.insertedId),
    })
    .then((data) =>
      // Add image url for avatar to customer document in MongoDB
      {
        customersDB.updateOne(
          { _id: new ObjectId(String(customerID.insertedId)) },
          {
            $set: { avatar: data.secure_url },
          }
        );
        return res
          .status(200)
          .send({ data: `Added customer: ${customerID.insertedId}` });
      }
    )
    .catch((err) => {
      return res
        .status(500)
        .send("Problem uploading avatar to Cloudinary: \n", err);
    });
});

// Apply info changes to customer in MongoDB
router.put("/update/:id", async (req, res) => {
  const customerData = req.body;

  await customersDB
    .updateOne(
      { _id: new ObjectId(String(req.params.id)) },
      {
        $set: {
          name: customerData.name,
          subscription: customerData.subscription,
          phone: customerData.phone,
          email: customerData.email,
        },
      }
    )
    .then((data) => {
      if (data.matchedCount === 0) {
        return res.status(500).send("Mismatched ID or did not find customer");
      }
      return res.status(200).send({ data: "Updated customer" });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// Delete a customer
router.delete("/delete/:id", async (req, res) => {
  // Delete customer from MongoDB
  const dbResult = await customersDB
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .catch((e) => {
      return res.status(500).send("Unable to delete customer in MongoDB: ", e);
    });

  if (dbResult.acknowledged) {
    // Delete any appointments customers has made
    let appointmentsDB = mongoUtil.appointmentsDB;
    appointmentsDB.deleteMany({ customerID: req.params.id }).catch((e) => {
      return res
        .status(500)
        .send("Error deleting customer's appointments:\n", e);
    });

    cloudinary.uploader
      .destroy(req.params.id)
      .then((data) => {
        if (data.result === "not found") {
          return res
            .status(500)
            .send(`Public ID for image not found: ${req.params.id}`);
        }
        return res.status(200).send({ data: "Deleted customer" });
      })
      .catch((e) => {
        return res
          .status(500)
          .send("Unable to delete customer avatar: ", req.params.id, "\n", e);
      });
  }
});

module.exports = router;
