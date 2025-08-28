<template>
  <div class="flex gap-4 w-full justify-end">
    <component v-for="(tool, i) in activeTools" :is="tool" :key="i" />
  </div>
</template>

<script setup lang="ts">
import InvoiceTools from "./InvoiceTools.vue";
import MailTools from "./MailTools.vue";
import FileTools from "./FileTools.vue";
import CatalogTools from "./CatalogTools.vue";
import CustomerTools from "./CustomerTools.vue";
import InvoiceListTool from "./InvoiceListTools.vue";
// import UserTools from './tools/UserTools.vue'

const route = useRoute();

const toolMap: Record<string, any[]> = {
  "invoices-create": [InvoiceTools],
  "invoices-files": [FileTools],
  catalogs: [CatalogTools],
  customers: [CustomerTools],
  "invoices-list": [InvoiceListTool],
  // mail: [MailTools],
  // 'user': [UserTools],
  // 'dashboard': [InvoiceTools, UserTools],
};

const activeTools = computed(() => {
  const name = String(route.name || ""); // ป้องกัน undefined
  return toolMap[name] || [];
});
</script>
