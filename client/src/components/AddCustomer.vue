<script setup>
import { ref, onMounted } from "vue";
import ApiService from "../apiURL";
import { viewAddCustomer } from "./viewAddCustomer";
import Modal from "./Modal.vue";
import CloseIcon from "./icons/IconClose.vue";

// Keyboard focus when opening add customer form
onMounted(() => {
  document.getElementById("close-button").focus();
});

const avatar = ref(null);
const name = ref(null);
const email = ref(null);
const phone = ref(null);
const subscription = ref(null);

function convertImage(img) {
  const imagePreview = document.getElementById("preview");
  console.log(img);
  if (!img) {
    imagePreview.style.display = "none";
    return;
  }
  const image = URL.createObjectURL(img);
  imagePreview.src = image;
  imagePreview.style.display = "block";

  let reader = new FileReader();
  reader.onloadend = function () {
    avatar.value = reader.result;
  };
  reader.readAsDataURL(img);
}

function submitCustomer() {
  name.value = document.getElementById("name").value;
  email.value = document.getElementById("email").value;
  phone.value = document.getElementById("phone").value;
  subscription.value = document.getElementById("subscription").value;
  const today = new Date().toLocaleDateString("en-IN");
  const newCustomer = {
    avatar: avatar.value,
    name: name.value,
    email: email.value,
    phone: phone.value,
    subscription: subscription.value,
    last_visit: today,
    notes: [],
  };
  ApiService.addCustomer(newCustomer).then(() => window.location.reload());
}

function closeForm() {
  viewAddCustomer.toggle(false);
}
</script>

<template>
  <Modal :toggle="closeForm">
    <div id="form-container" @click.stop>
      <!-- Close button -->
      <div id="close-section">
        <button id="close-button" @:click="() => closeForm()">
          <CloseIcon height="40px" width="40px" />
        </button>
      </div>

      <form id="inputs">
        <!-- Image upload with preview -->
        <div id="form-left">
          <div>
            <label for="image">Image:</label>
            <input
              type="file"
              required
              name="image"
              accept="image/*"
              @change="(e) => convertImage(e.target.files[0])"
            />
          </div>
          <img id="preview" />
        </div>

        <!-- Text based input form -->
        <div id="form-right">
          <div>
            <label for="name">Name:</label>
            <input type="text" required name="name" id="name" />
          </div>

          <div>
            <label for="email">Email:</label>
            <input type="email" required name="email" id="email" />
          </div>

          <div>
            <label for="phone">Phone:</label>
            <input
              type="tel"
              required
              name="phone"
              id="phone"
              maxlength="10"
              minlength="10"
              placeholder="Ex. 1234567890"
            />
          </div>

          <div>
            <label for="subscription">Subscription:</label>
            <select name="subscription" id="subscription">
              <option value="Regular">Regular</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          <input
            type="button"
            id="submit"
            value="Submit"
            @click="() => submitCustomer()"
          />
        </div>
      </form>
    </div>
  </Modal>
</template>

<style scoped>
#form-container {
  background-color: white;
  border-radius: 0.5rem;
  box-sizing: border-box;
  width: 100svw;
  height: 100svh;
  overflow-y: auto;
  overflow-x: hidden;
}
#form-container:hover {
  cursor: default !important;
}

#close-section {
  display: flex;
  justify-content: flex-end;
}

#close-button {
  background-color: transparent !important;
  padding: 0.25rem;
  border: none;
}
#close-section > button:hover {
  color: grey;
  transition-duration: 250ms;
}

#close-section {
  text-align: center;
}
#close-section > div {
  margin-bottom: 1rem;
}

#inputs {
  padding: 1rem;
}
#inputs > div:not(:last-of-type) {
  margin-bottom: 1rem;
}

#form-left > div {
  margin-bottom: 1rem;
}
#preview {
  display: none;
  width: 140px;
  height: 190px;
  border-radius: 0.5rem;
  object-fit: cover;
}
#form-right {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
#form-right > div {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#submit {
  background-color: transparent;
  border: 1px solid grey;
  padding: 0.5rem;
  font-weight: bold;
  border-radius: 0.5rem;
}
#submit:hover {
  cursor: pointer;
  background-color: grey;
  transition-duration: 250ms;
}

@media screen and (min-width: 760px) {
  #form-container {
    height: 75svh;
    width: 700px;
  }
  #inputs {
    display: flex;
  }
}
</style>
