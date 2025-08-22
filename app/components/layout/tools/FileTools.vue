<template>
  <div class="toolbar flex items-center justify-between gap-2 transition">
    <BaseSearchInput
      type="text"
      place-holder="ค้นหาไฟล์"
      v-model="searchInput"
    />
    <div class="flex gap-4 items-center">
      <BaseButton
        class="text-sm transition"
        :disabled="fileStore.selectFilesCount === 0"
        ><Download />
        <p class="hidden sm:block">ดาวน์โหลด</p></BaseButton
      >
      <BaseButton
        variant="ghost"
        v-if="fileStore.showView === 'list'"
        @click="showView('grid')"
      >
        <List class="h-4 w-4" />
      </BaseButton>
      <BaseButton
        variant="ghost"
        v-if="fileStore.showView === 'grid'"
        @click="showView('list')"
      >
        <Grid2x2 class="h-4 w-4" />
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDebounceFn } from "@vueuse/core";
import { Download, Grid2x2, List, X } from "lucide-vue-next";

const fileStore = useFileExplorerStore();
const searchInput = ref(fileStore.searchQuery);

function showView(v: "grid" | "list") {
  fileStore.setShowView(v);
}

// ✅ debounce update ค่าใน store
const updateSearchQuery = useDebounceFn((val: string) => {
  fileStore.searchQuery = val;
}, 300);

watch(searchInput, (val) => {
  updateSearchQuery(val);
});
</script>

<style></style>
