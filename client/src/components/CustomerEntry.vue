<script setup>
import { viewCustomer } from "./viewCustomer.js";
import { showInfo } from "./showInfo";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const openCustomerProfile = () => {
  viewCustomer.select({
    id: props.data._id,
    avatar: props.data.avatar,
    name: props.data.name,
    subscription: props.data.subscription,
    phone: props.data.phone,
    email: props.data.email,
    notes: props.data.notes,
    last_visit: props.data.last_visit,
  });
  viewCustomer.toggle(true);
  document.body.style.overflowY = "hidden";
};

stop();
</script>

<template>
  <!-- Customer row container with keyboard support -->
  <div
    id="customer-entry"
    tabindex="0"
    @keyup.enter="() => openCustomerProfile()"
    @:click="() => openCustomerProfile()"
    :style="{
      gridTemplateColumns: `repeat(${2 + showInfo.infoCount}, 1fr)`,
    }"
  >
    <p>
      <img class="customer-avatar" :src="props.data.avatar" />{{ data.name }}
    </p>
    <p>{{ data.subscription }}</p>

    <!-- Render additional customer info based on window size -->
    <p :style="[showInfo.infoCount < 1 && { display: 'none' }]">
      {{ data.phone }}
    </p>
    <p :style="[showInfo.infoCount < 2 && { display: 'none' }]">
      {{ data.email }}
    </p>
    <p :style="[showInfo.infoCount < 3 && { display: 'none' }]">
      {{ data.last_visit }}
    </p>
  </div>
</template>

<style scoped>
div {
  padding: 0.5rem;
  display: grid;
}
div:hover {
  background-color: rgb(202, 202, 202);
  cursor: pointer;
  transition-duration: 250ms;
}

div > p {
  word-wrap: break-word;
  display: flex;
  place-items: center;
}

.customer-avatar {
  height: 40px !important;
  max-width: 40px !important;
  min-width: 40px;
  border-radius: 60px;
  margin-right: 1rem;
  object-fit: cover;
}
</style>
