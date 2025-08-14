import { defineStore } from "pinia";
import type { Product } from "~/composables/types/product";

export const useCatalogStore = defineStore("catalogStore", () => {
  const productsList = ref<Product[]>([]);

  function setProductList(products: Product[]) {
    productsList.value = products;
  }

  return { productsList, setProductList };
});
