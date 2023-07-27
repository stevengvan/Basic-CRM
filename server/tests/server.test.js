const request = require("supertest");
const fs = require("fs");
const app = require("../server");
const { MongoClient } = require("mongodb");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const client = new MongoClient(process.env.NODE_ENV_MONGODB_URL);

/* Connecting to the database before each test. */
beforeAll(async () => {
  client.connect();
});

/* Closing database connection after each test. */
afterAll(async () => {
  client.close();
});

var newUser = ""; //test user to be removed during test
var newNote = ""; //test note to be removed during test

describe("POST /customers", () => {
  it("/add should add a new customer (will be newUser) to the database", async () => {
    let header = "data:image/png;base64,";
    let encoding = fs.readFileSync("tests/Franky.png", { encoding: "base64" });
    let avatar = header.concat(encoding);
    const res = await request(app).post("/customers/add").send({
      avatar: avatar,
      name: "Test User",
      email: "test@gmail.com",
      phone: "1231231234",
      subscription: "Regular",
      last_visit: "1/2/2023",
      notes: [],
    });

    newUser = res.body.data.match(/\b(?!Added|customer|:$)[a-zA-Z0-9]+/g)[0];
    expect(res.body.data).toMatch(/(Added customer:) [a-zA-Z0-9]+/g);
  });

  it("/notes/add/:id should add a new note (will be newNote) to newUser", async () => {
    const res = await request(app)
      .post(`/customers/notes/add/${newUser}`)
      .send({ note: "Test note created" });

    newNote = res.body.data.match(/\b(?!Created|new|note|:$)[a-zA-Z0-9]+/g)[0];
    expect(res.body.data).toMatch(/(Created new note:) [a-zA-Z0-9]+/g);
  });
});

describe("GET /customers", () => {
  it("/all should return an array with any or no customers", async () => {
    const res = await request(app).get("/customers/all");
    expect(res.body).toBeInstanceOf(Array);
  });

  it("/:id should return an object with any or no customer", async () => {
    const res = await request(app).get(`/customers/${newUser}`);
    expect(res.body).toBeInstanceOf(Object);
  });
});

describe("PUT /customers", () => {
  it("/update/:id should update newUser's information", async () => {
    const res = await request(app).put(`/customers/update/${newUser}`).send({
      name: "Test User 2000",
      subscription: "Premium",
      phone: "1234567890",
      email: "test2000@gmail.com",
    });

    expect(res.body.data).toMatch(/(Updated customer)/g);
  });

  it("/notes/update/:id/:noteID should update newNote from newUser", async () => {
    const res = await request(app)
      .put(`/customers/notes/update/${newUser}/${newNote}`)
      .send({ note: "Test note created" });

    expect(res.body.data).toMatch(/(Updated note) [a-zA-Z0-9]+/g);
  });
});

describe("DELETE /customers", () => {
  it("/notes/delete/:id/:noteID should delete newNote from newUser", async () => {
    const res = await request(app).delete(
      `/customers/notes/delete/${newUser}/${newNote}`
    );

    expect(res.body.data).toMatch(/(Removed note) [a-zA-Z0-9]+/g);
  });

  it("/delete/:id should delete newUser", async () => {
    const res = await request(app).delete(`/customers/delete/${newUser}`);
    expect(res.body.data).toMatch(/(Deleted customer)/g);
  });
});

describe("GET /appointments", () => {
  it("/all should return an array with any or no appointments", async () => {
    const res = await request(app).get("/appointments/all");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("/month/:month should return an array wtih any or no appointments for queried month", async () => {
    const res = await request(app).get("/appointments/month/05");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});

let newAppointment = "";
let customUser = "646a815fd9706eaceaa1bf3a";
let newAppointmentNote = "";
describe("POST /appointments", () => {
  it("/add should add a new appointment (called newAppointment for test)", async () => {
    const res = await request(app).post("/appointments/add").send({
      date: "5/25/2023",
      customerID: customUser,
      customer: "Penny",
      type: "software testing",
      time: "12:00",
      notes: [],
    });

    newAppointment = res.body.data.match(
      /\b(?!Added|new|appointment|:$)[a-zA-Z0-9]+/g
    )[0];
    expect(res.body.data).toMatch(/(Added new appointment:) [a-zA-Z0-9]+/g);
  });

  it("/notes/add/:id should add a new note (will be newNote) to newAppointment", async () => {
    const res = await request(app)
      .post(`/appointments/notes/add/${customUser}`)
      .send({ note: "Test note created" });

    newAppointmentNote = res.body.data.match(
      /\b(?!Created|new|note|:$)[a-zA-Z0-9]+/g
    )[0];
    expect(res.body.data).toMatch(/(Created new note:) [a-zA-Z0-9]+/g);
  });
});

describe("PUT /appointments", () => {
  it("/update/:id should update newAppointment's information", async () => {
    const res = await request(app)
      .put(`/appointments/update/${newAppointment}`)
      .send({
        date: "5/30/2023",
        type: "computer destruction",
        time: "16:00",
      });

    expect(res.body.data).toMatch(/(Updated appointment)/g);
  });

  it("/notes/update/:id/:noteID should update newAppointmentNote from newAppointment", async () => {
    const res = await request(app)
      .put(`/appointments/notes/update/${newAppointment}/${newAppointmentNote}`)
      .send({ note: "Test note created" });

    expect(res.body.data).toMatch(/(Updated note) [a-zA-Z0-9]+/g);
  });
});

describe("DELETE /appointments", () => {
  it("/notes/delete/:id/:noteID should delete newAppointmentNote from newAppointment", async () => {
    const res = await request(app).delete(
      `/appointments/notes/delete/${newAppointment}/${newAppointmentNote}`
    );

    expect(res.body.data).toMatch(/(Removed note) [a-zA-Z0-9]+/g);
  });

  it("/delete/:id should delete newAppointment", async () => {
    const res = await request(app).delete(
      `/appointments/delete/${newAppointment}`
    );

    expect(res.body.data).toMatch("Deleted appointment");
  });
});
