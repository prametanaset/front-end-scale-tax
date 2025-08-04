<template>
  <div class="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-theme(spacing.20))]">
    <div
      class="min-h-[100vh] flex flex-1 rounded-xl bg-muted/50 md:min-h-min items-center justify-center"
    >
      <div class="flex flex-col items-center justify-center">
        <FeatureInvoiceFirstCreate />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  breadcrumb: [{ label: "รายงานใบแจ้งหนี้" }],
});
const name = ref("");
</script>

<style></style>
