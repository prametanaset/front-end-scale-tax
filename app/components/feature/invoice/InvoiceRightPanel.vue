<template>
  <div class="flex-1 rounded-xl flex justify-center">
    <FeatureSummaryTotalBill />
  </div>
  <div class="flex-1 flex flex-col min-h-0">
    <Label class="my-2">หมายเหตุ</Label>
    <InvoiceNote v-model:note="note" class="flex-1 w-full p-4 overflow-auto" />
  </div>
</template>

<script setup lang="ts">
import InvoiceNote from "@/components/feature/invoice/InvoiceNote.vue";
const note = ref("");
</script>
