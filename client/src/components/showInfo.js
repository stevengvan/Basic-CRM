import { reactive } from "vue";
export const showInfo = reactive({
  infoCount: 0,
  set(value) {
    this.infoCount = value;
  },
});
