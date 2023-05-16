<script setup>
import { reactive, ref, watchEffect, onBeforeMount } from "vue";
import { useWindowSize } from "@vueuse/core";
import { customersData } from "./customersData";
import { showInfo } from "./showInfo";
import CustomerEntry from "./CustomerEntry.vue";

// Customers data
const customers = reactive({
  list: customersData.list,
  newList(value) {
    this.list = [...value];

    // Update customer list by page
    totalCustomers.value = value.length;
    remainder.value = totalCustomers.value % 10;
    lastPage.value =
      remainder.value === 0
        ? (totalCustomers.value - remainder.value) / 10
        : 1 + (totalCustomers.value - remainder.value) / 10;
  },
});

// Customers listing by 10s
const totalCustomers = ref(customersData.list.length);
const remainder = ref(totalCustomers.value % 10);
const lastPage = ref(
  remainder.value === 0
    ? (totalCustomers.value - remainder.value) / 10
    : 1 + (totalCustomers.value - remainder.value) / 10
);
const pageIndices = reactive({
  list: Array.from({ length: lastPage.value }, (_, i) => i + 1),
  toggle: false,
});
const currentPage = ref(1);
const currentPageList = ref([]);

const setPageList = (page) => {
  // Prevent going beyond listed pages
  if (page < 1 || page > lastPage.value) {
    return;
  }

  //Update new page list
  currentPage.value = page;
  currentPageList.value = [];
  for (let i = 10 * (page - 1); i < 10 * page; i++) {
    if (i < totalCustomers.value) {
      currentPageList.value.push(customers.list[i]);
    }
  }

  // Close any open page list
  pageIndices.toggle = false;
};

// Add column headers by window size
const { width } = useWindowSize();
const currHeaders = ref(showInfo.infoCount);
onBeforeMount(() => {
  setPageList(1);
}),
  watchEffect(() => {
    if (width.value < 600) {
      showInfo.set(0);
    }
    if (width.value >= 600) {
      showInfo.set(1);
    }
    if (width.value > 800) {
      showInfo.set(2);
    }
    if (width.value > 1100) {
      showInfo.set(3);
    }
    if (currHeaders.value !== showInfo.infoCount) {
      setPageList(1);
      currHeaders.value = showInfo.infoCount;
    }
  });

// Customer fields sorting
const sortType = {
  name: ref(false),
  subscription: ref(false),
  phone: ref(false),
  email: ref(false),
  last_visit: ref(false),
};
function changeSort(type) {
  for (const currType of Object.keys(sortType)) {
    if (currType !== type) {
      sortType[currType].value = false;
    }
  }
  sortType[type].value = !sortType[type].value;
}
function sort(type) {
  changeSort(type);
  if (sortType[type].value === 0) {
    customers.newList(customersData.list);
  } else {
    customers.list.sort(function (a, b) {
      if (a[type] < b[type]) {
        return -1;
      } else if (a[type] > b[type]) {
        return 1;
      } else {
        return 0;
      }
    });
    if (sortType[type].value) {
      customers.newList(customers.list.reverse());
    }
  }
  setPageList(1);
}

// Subscription filtering
const currentFilter = ref("All members");
watchEffect(() => {
  if (currentFilter.value !== customersData.filter) {
    if (customersData.filter === "All members") {
      customers.newList(customersData.list);
    } else {
      customers.newList(
        customersData.list.filter(
          (customer) => customer.subscription === customersData.filter
        )
      );
    }
    currentFilter.value = customersData.filter;
    setPageList(1);
  }
});

// Customer search
const currentSearch = ref("");
watchEffect(() => {
  if (currentSearch.value !== customersData.currentSearch) {
    if (customersData.currentSearch === "") {
      customers.newList(customersData.list);
    } else {
      // Search by whether name contains searched string
      customers.newList(
        customersData.list.filter(
          (customer) =>
            customer.name
              .toLowerCase()
              .includes(customersData.currentSearch.toLowerCase()) === true
        )
      );
    }
    setPageList(1);
    currentSearch.value = customersData.currentSearch;
  }
});
</script>

<template>
  <!-- Column headers -->
  <div
    id="customer-list-headers"
    :style="{
      gridTemplateColumns: `repeat(${2 + showInfo.infoCount}, 1fr)`,
    }"
  >
    <!-- Column headers -->
    <button @click="sort('name')">Name</button>
    <button @click="sort('subscription')">Subscription</button>
    <!-- Render additional column headers depending on window size -->
    <button
      :style="[showInfo.infoCount < 1 && { display: 'none' }]"
      @click="sort('phone')"
    >
      Phone
    </button>
    <button
      :style="[showInfo.infoCount < 2 && { display: 'none' }]"
      @click="sort('email')"
    >
      Email
    </button>
    <button
      :style="[showInfo.infoCount < 3 && { display: 'none' }]"
      @click="sort('last_visit')"
    >
      Last Visit
    </button>
  </div>

  <!-- Encased in a div to rerender when changing currentPageList -->
  <div id="customer-entry" v-for="customer in currentPageList">
    <CustomerEntry v-if="customer" :data="customer" />
  </div>

  <!-- Page control buttons -->
  <div id="page-buttons-container">
    <!-- Goto first page -->
    <button @click="() => setPageList(1)">&#60;&#60;</button>

    <!-- Go back 1 page -->
    <button @click="setPageList(currentPage - 1)">&#60;</button>

    <!-- Page indices list -->
    <div id="page-indices-container" v-if="pageIndices.toggle">
      <button v-for="index in pageIndices.list" @click="setPageList(index)">
        {{ index }}
      </button>
    </div>

    <!-- Current page index -->
    <button @click="pageIndices.toggle = !pageIndices.toggle">
      {{ currentPage }}
    </button>

    <!-- Go forward 1 page -->
    <button @click="setPageList(currentPage + 1)">&#62;</button>

    <!-- Goto last page -->
    <button @click="setPageList(lastPage)">&#62;&#62;</button>
  </div>
</template>

<style scoped>
#customer-list-headers {
  border-bottom: 1px solid grey;
  height: 40px;
  display: grid;
  width: 100%;
}
#customer-list-headers > button {
  word-break: break-all;
  background-color: transparent;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  display: flex;
  place-items: center;
  text-align: left;
}
#customer-list-headers > button:hover {
  background-color: rgb(202, 202, 202);
  transition: 250ms;
}

#customer-entry > * {
  border-bottom: 1px solid grey;
}

#page-buttons-container {
  margin-top: 1.5rem;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: flex-end;
  position: relative;
}
#page-buttons-container > button {
  background-color: transparent;
  border: none;
}
#page-buttons-container > button:hover {
  background-color: grey;
  transition-duration: 250ms;
}
#page-buttons-container > button:nth-child(3) {
  height: 23px;
}
#page-buttons-container > button:not(:nth-child(3)) {
  font-size: 20px;
  width: 35px;
}
#page-buttons-container > button:nth-child(3) {
  font-size: 15px;
  width: 50px;
}

#page-indices-container {
  background-color: white;
  border: 1px solid black;
  max-height: 175px;
  overflow-y: auto;
  width: 100px;
  position: absolute;
  bottom: 1.5rem;
}
#page-indices-container > button {
  padding: 0.5rem 0;
  background-color: transparent;
  border: none;
  width: 100%;
}
#page-indices-container > button:hover {
  background-color: grey;
  transition-duration: 250ms;
}
</style>
