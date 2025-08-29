<template>
  <div class="flex items-center justify-end w-full gap-4">
    <BaseSearchInput
      v-model="q"
      place-holder="ค้นหาด้วยหมายเลขใบกำกับภาษี
"
    />
  </div>
</template>

<script lang="ts" setup>
import { useDebounceFn } from "@vueuse/core";

const toolsStore = useToolsStore();
const q = ref("");

// ✅ debounce update ค่าใน store
const updateSearchQuery = useDebounceFn((val: string) => {
  toolsStore.setQuery(val);
}, 300);

watch(
  q,
  (val) => {
    updateSearchQuery(val);
  },
  { immediate: true }
);
</script>

<style></style>
