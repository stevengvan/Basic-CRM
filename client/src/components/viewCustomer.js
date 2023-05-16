import { reactive } from "vue";
export const viewCustomer = reactive({
  viewing: false,
  toggle(value) {
    this.viewing = value;
  },
  selectedCustomer: {},
  select(customer) {
    this.selectedCustomer = JSON.parse(JSON.stringify(customer));
  },
});
