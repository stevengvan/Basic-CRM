<script setup>
import { ref, onMounted } from "vue";
import ApiService from "../apiURL";
import { viewCustomer } from "./viewCustomer";
import NotesList from "./NotesList.vue";
import Modal from "./Modal.vue";
import CloseIcon from "./icons/IconClose.vue";
import TrashIcon from "./icons/IconTrash.vue";

const customerData = viewCustomer.selectedCustomer;
const currentDate = new Date().toLocaleDateString("en-IN");
const deletePopup = ref(false);
const editMode = ref(false);

// Keyboard focus when opening profile
onMounted(() => {
  document.getElementById("close-button").focus();
});

const closeProfile = () => {
  viewCustomer.toggle(false);
  document.body.style.overflowY = "auto";
};

const updateCustomer = async () => {
  const values = {
    id: customerData.id,
    name: document.getElementById("name").value,
    subscription: document.getElementById("subscription").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
  };
  ApiService.updateCustomer(values).then(() => window.location.reload());
};

const deleteCustomer = async () => {
  ApiService.deleteCustomer(customerData.id).then(() =>
    window.location.reload()
  );
};
</script>

<template>
  <Modal :toggle="closeProfile">
    <div id="profile-container" @click.stop>
      <!-- Delete confirmation page -->
      <div id="delete-popup" v-if="deletePopup">
        <div>
          <p>Are you sure you want to remove this customer?</p>
          <form id="delete-options">
            <input type="button" value="Cancel" @click="deletePopup = false" />
            <input type="button" value="Delete" @click="deleteCustomer()" />
          </form>
        </div>
      </div>

      <!-- Close button -->
      <div id="profile-close-container" v-if="!deletePopup">
        <button id="close-button" @:click="() => closeProfile()">
          <CloseIcon height="40px" width="40px" />
        </button>
      </div>

      <!-- Main content -->
      <div id="overview-container" v-if="!deletePopup">
        <div id="header-container">
          <img :src="customerData.avatar" />

          <!-- Customer main info -->
          <div id="header-info">
            <!-- Customer's name -->
            <div id="name-container">
              <h2 v-if="!editMode">{{ customerData.name }}</h2>
              <input
                id="name"
                v-if="editMode"
                type="text"
                :value="customerData.name"
              />
              <p v-if="!editMode">{{ customerData.subscription }}</p>
              <select
                id="subscription"
                v-if="editMode"
                :value="customerData.subscription"
                name="subscription"
              >
                <option value="Regular">Regular</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <!-- Last visited -->
            <div id="activity-container">
              <p>
                Visited
                {{
                  customerData.last_visit === currentDate
                    ? "today"
                    : customerData.last_visit
                }}
              </p>
            </div>

            <!-- Customer's contact info -->
            <div id="contacts">
              <!-- Phone number -->
              <p class="contact-info">
                <span>Phone:</span>
                {{ !editMode ? customerData.phone : "" }}
                <input
                  id="phone"
                  v-if="editMode"
                  type="text"
                  :value="customerData.phone"
                />
              </p>

              <!-- Email -->
              <p class="contact-info">
                <span>Email:</span>
                {{ !editMode ? customerData.email : "" }}
                <input
                  id="email"
                  v-if="editMode"
                  type="text"
                  :value="customerData.email"
                />
              </p>
            </div>

            <!-- Profile options -->
            <div id="options-container">
              <button
                class="options-button"
                @click="editMode ? updateCustomer() : (editMode = true)"
              >
                {{ editMode ? "Update" : "Edit" }}
              </button>
              <button
                class="options-button"
                @click="editMode ? (editMode = false) : (deletePopup = true)"
              >
                <TrashIcon v-if="!editMode" height="20px" width="20px" />{{
                  !editMode ? "Delete" : "Cancel"
                }}
              </button>
            </div>
          </div>
        </div>

        <!-- All notes on customer -->
        <NotesList />
      </div>
    </div>
  </Modal>
</template>

<style scoped>
button {
  background-color: rgb(210, 210, 210);
  font-size: 16px;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
}
button:hover {
  background-color: rgb(150, 150, 150);
  transition-duration: 250ms;
}
button > *:first-child {
  margin-right: 0.5rem;
}

#profile-container {
  height: 100%;
  width: 100%;
  background-color: white;
  overflow-y: auto;
  overflow-x: hidden;
}
#profile-container:hover {
  cursor: default !important;
}

#delete-popup {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
#delete-popup > div > p {
  margin-bottom: 1.5rem;
}
#delete-options {
  display: flex;
  gap: 0.5rem;
  place-content: center;
}
#delete-options > input {
  border: 1px solid grey;
  font-weight: bold;
  background-color: transparent;
  padding: 0.5rem;
  border-radius: 0.5rem;
}
#delete-options > input:hover {
  cursor: pointer;
  transition-duration: 250ms;
}
#delete-options > input:first-child:hover {
  background-color: grey;
}
#delete-options > input:last-child {
  background-color: lightcoral;
  border-color: lightcoral;
}
#delete-options > input:last-child:hover {
  background-color: orangered;
  border-color: orangered;
}

#profile-close-container {
  display: flex;
  justify-content: flex-end;
}
#profile-close-container > button {
  background-color: transparent !important;
  border: none;
}
#profile-close-container > button:hover {
  color: grey;
  transition-duration: 250ms;
}

#overview-container {
  padding: 1rem 2.5rem 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
}
#overview-container > img {
  width: 140px;
  height: 190px;
  margin-right: 1rem;
  border-radius: 0.5rem;
  object-fit: cover;
}
#overview-container > div:not(:first-child) {
  border-top: 1px solid grey;
  padding-top: 1.5rem;
}

#header-container {
  display: flex;
  margin-bottom: 1.5rem;
}
#header-container > img {
  width: 140px;
  height: 190px;
  margin-right: 1rem;
  border-radius: 0.5rem;
  object-fit: cover;
}

#header-info {
  word-break: break-all;
}
#header-info > div:not(:last-of-type) {
  margin-bottom: 1rem;
}

#name-container > p {
  width: fit-content;
  font-size: 12.5px;
  color: rgb(133, 180, 39);
  background-color: rgb(227, 248, 210);
  border-radius: 0.25rem;
  padding: 0.25rem;
}
#name-container > input {
  font-size: 1.5em;
}

#activity-container > p {
  color: grey;
  font-size: 0.85rem;
}

#options-container {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

#contacts {
  margin-bottom: 1.5rem;
}

.contact-info > span {
  font-weight: bold;
}
.contact-info:not(:last-of-type) {
  margin-bottom: 0.5rem;
}

@media screen and (min-width: 40rem) {
  #name-container {
    gap: 1rem;
    display: flex;
    place-items: center;
  }
}

@media screen and (min-width: 760px) {
  #profile-container {
    height: auto;
    border-radius: 0.5rem;
    width: 650px;
    height: 65svh;
  }

  #contacts > div {
    display: flex;
  }
}
</style>
