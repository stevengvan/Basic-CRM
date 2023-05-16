<script setup>
import { Suspense } from "vue";
import SearchIcon from "./components/icons/IconSearch.vue";
import { viewCustomer } from "./components/viewCustomer.js";
import { viewAddCustomer } from "./components/viewAddCustomer";
import { customersData } from "./components/customersData";
import CustomerList from "./components/CustomerList.vue";
import CustomerProfile from "./components/CustomerProfile.vue";
import AddCustomer from "./components/AddCustomer.vue";

const switchFilter = async () => {
  const selectedFilter = document.getElementById("filter-button");
  customersData.changeFilter(selectedFilter.value);
};
</script>

<template>
  <!-- Popup modals -->
  <CustomerProfile v-if="viewCustomer.viewing" />
  <AddCustomer v-if="viewAddCustomer.viewing" />

  <h1 id="title">Customer Relation Management</h1>

  <!-- Main content -->
  <main id="list-container">
    <!-- Menu -->
    <div id="list-header">
      <h1 id="list-header-text">All Customers</h1>

      <div id="search-bar">
        <SearchIcon />
        <input
          type="text"
          name="search"
          placeholder="Quick Search"
          v-on:change="(e) => customersData.search(e.target.value)"
        />
      </div>

      <select
        id="filter-button"
        :value="customersData.filter"
        v-on:change="() => switchFilter()"
      >
        <option value="All members">All members</option>
        <option value="Premium">Subscription (Premium)</option>
        <option value="Regular">Subscription (Regular)</option>
      </select>

      <button id="add-customer" @click="() => viewAddCustomer.toggle(true)">
        Add new customer
      </button>
    </div>

    <!-- List -->
    <Suspense>
      <CustomerList />
    </Suspense>
  </main>
</template>

<style scoped>
#title {
  font-size: 2rem;
  margin-bottom: 2rem;
}

#list-container {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 1.5rem;
  box-sizing: border-box;
  min-height: calc(87.5vh - 4rem);
  border-radius: 0.5rem;
}

#list-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
#list-header-text {
  margin-bottom: 1rem;
  font-weight: bold;
  line-height: 0.75;
}

#search-bar {
  border: 1px solid grey;
  padding: 0.25rem;
  align-self: stretch;
  border-radius: 0.5rem;
  height: fit-content;
  display: flex;
  place-items: center;
}
#search-bar:focus-within {
  border: 1px solid rgb(46, 175, 214);
}
#search-bar > input {
  border: none;
  height: 100%;
}
#search-bar > input:focus-visible {
  outline: none;
}

#filter-button {
  border: 1px solid grey;
  padding: 0.5rem;
  border-radius: 0.5rem;
  align-self: stretch;
  background-color: transparent;
}
#filter-button:hover {
  background-color: rgb(202, 202, 202);
  transition-duration: 250ms;
}

#add-customer {
  background-color: transparent;
  border: 1px solid grey;
  padding: 0.5rem;
  border-radius: 0.5rem;
}
#add-customer:hover {
  background-color: rgb(202, 202, 202);
  transition-duration: 250ms;
}

@media screen and (min-width: 840px) {
  #title {
    font-size: 3rem;
  }
  #list-header {
    flex-direction: row;
    align-items: center;
  }
  #list-header-text {
    margin-right: 2.5rem;
    margin-bottom: 0;
  }
}
</style>
