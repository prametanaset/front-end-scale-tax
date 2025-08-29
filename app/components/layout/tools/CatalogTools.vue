<template>
  <div class="flex items-center justify-end w-full gap-4">
    <BaseSearchInput
    class="h-8"
      v-model="q"
      place-holder="ค้นหาสินค้าด้วย SKU หรือ ชื่อสินค้า"
    />

    <div class="">
      <BaseButton @click="activeDialogAddProduct = true">
        <Plus class="w-4 h-4" /> เพิ่มสินค้า
      </BaseButton>
      <FeatureCatalogManageDialog
        mode="create"
        v-model="activeDialogAddProduct"
      />
    </div>

  </div>
</template>

<script lang="ts" setup>
import {  useDebounceFn, useMediaQuery } from "@vueuse/core";
import { Plus } from "lucide-vue-next";

const toolsStore = useToolsStore();
const q = ref("");
const activeDialogAddProduct = ref(false);

const isMobile = useMediaQuery("(max-width: 660px)");
const screenSize = computed(() => {
  if (isMobile.value) return "mobile";
  return "desktop";
});

// ✅ debounce update ค่าใน store
const updateSearchQuery = useDebounceFn((val: string) => {
  toolsStore.setQuery(val);
}, 300);

watch(q, (val) => {
    updateSearchQuery(val);
}, {immediate:true});
</script>

<style></style>
