import axios from "axios";
const baseURL = "https://basic-crm-server.adaptable.app";
// const baseURL = "http://localhost:3000/customers";

export default {
  // Retrieve all customers
  async getAllCustomers() {
    let res = await axios.get(`${baseURL}/all`);
    return res.data;
  },

  // Add a customer to the list
  async addCustomer(customer) {
    let res = await axios.post(`${baseURL}/add`, customer);
    return res.data;
  },

  // Update a customer's info
  async updateCustomer(update) {
    let res = await axios.put(`${baseURL}/update/${update.id}`, update);
    return res.data;
  },

  // Delete a customer from the list
  async deleteCustomer(customerID) {
    let res = await axios
      .delete(`${baseURL}/delete/${customerID}`)
      .catch((e) => console.log(e));
    return res.data;
  },

  // Add a note for a customer
  async addNote(customerID, newNote) {
    let res = await axios
      .put(`${baseURL}/notes/add/${customerID}`, {
        note: newNote,
      })
      .catch((e) => console.log(e));
    return res.data;
  },

  // Delete a note for a customer
  async deleteNote(customerID, noteID) {
    let res = await axios
      .put(`${baseURL}/notes/delete/${customerID}/${noteID}`)
      .catch((e) => console.log(e));
    return res.data;
  },

  // Update a note from a customer
  async updateNote(customerID, noteID, newText) {
    let res = await axios
      .put(`${baseURL}/notes/update/${customerID}/${noteID}`, {
        newText: newText,
      })
      .catch((e) => console.log(e));
    return res.data;
  },
};
