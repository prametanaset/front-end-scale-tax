<template>
  <div class="flex items-center justify-end w-full gap-4">
    <BaseSearchInput
      v-model="q"
      place-holder="ค้นหาด้วย หมายเลขผู้เสียภาษี หรือ ชื่อลูกค้า
"
    />

    <div class="">
      <BaseButton @click="addCustomer = true"
        ><Plus class="w-4 h-4" /> เพิ่มข้อมูลลูกค้า</BaseButton
      >
      <FeatureCustomerManageDialog mode="create" v-model="addCustomer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CalendarDate, type DateValue } from "@internationalized/date";
import { debouncedRef, useDebounceFn, useMediaQuery } from "@vueuse/core";
import { Plus, Send, Search, CalendarIcon } from "lucide-vue-next";
import { cn } from "~/lib/utils"; // Add this import for the cn utility

const toolsStore = useToolsStore();
const q = ref("");
const addCustomer = ref(false);

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
