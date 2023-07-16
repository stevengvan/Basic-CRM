// Basic setup for packages used
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const mongoUtil = require("./mongoUtil");
const PORT = 3000;

mongoUtil.connect;

// Express setup
app.use(cors());
app.use(bodyParser.json({ limit: "60mb" }));
app.use(express.urlencoded({ limit: "60mb", extended: true }));

const CustomersRoute = require("./routes/Customers");
const CustomersNotesRoute = require("./routes/CustomersNotes");
const AppointmentsRouter = require("./routes/Appointments");
const AppointmentsNotesRouter = require("./routes/AppointmentsNotes");
app.use("/customers", CustomersRoute);
app.use("/customers/notes", CustomersNotesRoute);
app.use("/appointments", AppointmentsRouter);
app.use("/appointments/notes", AppointmentsNotesRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server is live at port ${PORT}`));
}

module.exports = app;
