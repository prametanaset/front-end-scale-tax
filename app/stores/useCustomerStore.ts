import { defineStore } from "pinia";
import type { Customer } from "~/composables/types/customer";

export const useCustomerStore = defineStore("customerStore", () => {
  const customersList = ref<Customer[]>([]);

  function setCustomerList(customer: Customer[]) {
    customersList.value = customer;
  }

  return { customersList, setCustomerList };
});
