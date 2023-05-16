import { reactive } from "vue";
export const viewAddCustomer = reactive({
  viewing: false,
  totalCustomers: 0,
  limit: 30,
  toggle(value) {
    this.viewing = value;
  },
});
