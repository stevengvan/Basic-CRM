const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const mongoUtil = require("../mongoUtil");
const appointmentsDB = mongoUtil.appointmentsDB;

// Add a note to customer in MongoDB
router.post("/add/:id", async (req, res) => {
  const noteID = new ObjectId().toString();
  await appointmentsDB
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $push: {
          notes: {
            $each: [{ id: noteID, text: req.body.note }],
            $position: 0,
          },
        },
      }
    )
    .catch((e) => {
      return res
        .status(500)
        .send(`Unable to add new note for ${req.params.id}:\n`, e);
    });

  return res.status(200).send({ data: `Created new note: ${noteID}` });
});

// Update a note from a customer in MongoDB
router.put("/update/:id/:noteID", async (req, res) => {
  await appointmentsDB.updateOne(
    {
      _id: new ObjectId(req.params.id),
      "notes.id": req.params.noteID,
    },
    { $set: { "notes.$.text": req.body.note } }
  );

  return res.status(200).send({ data: `Updated note ${req.params.noteID}` });
});

// Delete a note from a customer in MongoDB
router.delete("/delete/:id/:noteID", async (req, res) => {
  await appointmentsDB.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $pull: { notes: { id: req.params.noteID } } }
  );

  return res.status(200).send({ data: `Removed note ${req.params.noteID}` });
});

module.exports = router;
