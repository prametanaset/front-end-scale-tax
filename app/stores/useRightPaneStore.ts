import { defineStore } from 'pinia'

export const useRightPaneStore = defineStore('rightPane', () => {
  const isRightExpanded = ref(false)

  function toggleExpand() {
    isRightExpanded.value = !isRightExpanded.value
  }

  return {
    isRightExpanded,
    toggleExpand,
  }
})
