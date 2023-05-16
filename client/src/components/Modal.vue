<script setup>
const props = defineProps({
  toggle: {
    type: Function,
    required: true,
  },
});

const closeModal = () => {
  props.toggle(false);
  document.body.style.overflowY = "auto";
};
</script>

<template>
  <div id="background-fade" @:click="() => closeModal()">
    <slot></slot>
  </div>
</template>

<style scoped>
#background-fade {
  background-color: rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  z-index: 100;
  inset: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
#background-fade:hover {
  cursor: pointer;
}

@media screen and (min-width: 760px) {
  #background-fade {
    padding: 2rem;
  }
}
</style>
