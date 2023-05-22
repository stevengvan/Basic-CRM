<script setup>
import { ref } from "vue";
import ApiService from "../apiURL";
import PlusIcon from "./icons/IconPlus.vue";
import TrashIcon from "./icons/IconTrash.vue";
import { viewCustomer } from "./viewCustomer";

const { id, notes } = viewCustomer.selectedCustomer;
const newNote = ref(false);
const editNote = ref({ show: false, key: null, old: "" });
const deleteConfirm = ref(false);

function toggleEdit(note) {
  editNote.value.show = true;
  editNote.value.key = note.id;
  editNote.value.old = note.text;
}

function deletePopup() {
  if (!deleteConfirm.value) {
    editNote.value.show = false;
    editNote.value.key = null;
  } else {
    deleteConfirm.value = false;
  }
}

const addNote = async () => {
  const note = document.getElementById("new-note").value;
  if (note.length === 0) {
    alert("Text must be provided when adding a note");
    return;
  }
  ApiService.addNote(id, note).then(() => window.location.reload());
};

const deleteNote = async (noteID) => {
  console.log("Deleting note", noteID);
  ApiService.deleteNote(id, noteID).then(() => window.location.reload());
};

const updateNote = async (noteID) => {
  const newNote = document.getElementById("edit-note").value;
  if (newNote !== editNote.value.old) {
    console.log("Updating note", noteID);
    ApiService.updateNote(id, noteID, newNote).then(() =>
      window.location.reload()
    );
  } else {
    alert(
      "No changes on note detected, cancel or change the note text to submit"
    );
  }
};
</script>

<template>
  <!-- Container header -->
  <div id="notes-container-header">
    <p>Notes</p>
    <button
      @click="
        () => {
          newNote = true;
          editNote.show = false;
        }
      "
    >
      <PlusIcon height="17.5px" width="17.5px" /> Add note
    </button>
  </div>

  <!-- Add note -->
  <div v-if="newNote" id="add-note-container">
    <!-- New note input -->
    <textarea
      id="new-note"
      class="note-input"
      maxlength="250"
      placeholder="Type note here..."
    ></textarea>

    <!-- New note options -->
    <div class="buttons-container">
      <button v-if="newNote" @click="newNote = false">Cancel</button>
      <button v-if="newNote" @click="addNote()">Submit</button>
    </div>
  </div>

  <!-- Notes List -->
  <div id="note-container" v-for="note in notes" :key="note.id">
    <!-- Note text -->
    <button
      v-if="!editNote.show || note.id !== editNote.key"
      :disabled="newNote"
      @click="
        () => {
          toggleEdit(note);
        }
      "
    >
      {{ note.text }}
    </button>

    <!-- Note edit -->
    <textarea
      id="edit-note"
      class="note-input"
      v-if="editNote.show && note.id === editNote.key && !newNote"
      maxlength="250"
      :value="note.text"
    ></textarea>

    <!-- Note options -->
    <div
      class="buttons-container"
      v-if="editNote.show && note.id === editNote.key && !newNote"
    >
      <p v-if="deleteConfirm">Are you sure you want to delete this note?</p>
      <button @click="deletePopup">Cancel</button>
      <button
        :id="deleteConfirm && 'confirm-delete'"
        @click="deleteConfirm ? deleteNote(note.id) : (deleteConfirm = true)"
      >
        <TrashIcon v-if="!editNote" height="20px" width="20px" />Delete
      </button>
      <button v-if="!deleteConfirm" @click="updateNote(note.id)">Update</button>
    </div>
  </div>
</template>

<style scoped>
#notes-container-header {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#add-note-container {
  margin-bottom: 0.5rem;
}

#note-container:not(:last-of-type) {
  margin-bottom: 0.5rem;
}
#note-container > button {
  background-color: #ffffb5;
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
}
#note-container > button:hover {
  background-color: #e6ca7e;
}

.note-input {
  width: 100%;
  height: 75px;
  background-color: #ffffb5;
}

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

.buttons-container {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;
  justify-content: flex-end;
}

#confirm-delete {
  background-color: lightcoral;
  border-color: lightcoral;
}
#confirm-delete:hover {
  background-color: orangered;
  border-color: orangered;
}
</style>
