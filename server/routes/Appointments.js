const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const mongoUtil = require("../mongoUtil");
const appointmentsDB = mongoUtil.appointmentsDB;

// Retrieve all appointments
router.get("/all", async (req, res) => {
  const list = await appointmentsDB.find().toArray();

  return res.status(200).send(list);
});

// Retrieve appointments for a month
router.get("/month/:month", async (req, res) => {
  const list = await appointmentsDB
    .find({
      date: { $regex: `^(${req.params.month})` },
    })
    .toArray();
  return res.status(200).send(list);
});

// Add new appointment to a date
router.post("/add", async (req, res) => {
  await appointmentsDB
    .insertOne(req.body)
    .then((data) => {
      return res
        .status(200)
        .send({ data: `Added new appointment: ${data.insertedId}` });
    })
    .catch((e) => {
      return res.status(500).send("Unable to add appointment:\n", e);
    });
});

// Update appointment information
router.put("/update/:id", async (req, res) => {
  const appointmentData = req.body;
  await appointmentsDB
    .updateOne(
      { _id: new ObjectId(String(req.params.id)) },
      {
        $set: {
          date: appointmentData.date,
          type: appointmentData.type,
          time: appointmentData.time,
        },
      }
    )
    .then((data) => {
      if (data.matchedCount === 0) {
        return res
          .status(500)
          .send({ data: "Mismatched ID or did not find appointment" });
      }
      return res.status(200).send({ data: "Updated appointment" });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// Delete appointment
router.delete("/delete/:id", async (req, res) => {
  await appointmentsDB
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(() => {
      return res.status(200).send({ data: "Deleted appointment" });
    })
    .catch((e) => {
      return res.status(500).send("Unable to delete customer in MongoDB: ", e);
    });
});

module.exports = router;
