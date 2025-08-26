import { defineStore } from "pinia";

export const useToolsStore = defineStore("toolsStore", () => {
  const query = ref('')

  function setQuery(q: string){
    query.value = q
  }

  return { query, setQuery };
});
