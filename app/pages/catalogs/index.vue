<template>
  <div class="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-theme(spacing.20))]">
    <!-- <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> -->
    <div class="flex flex-col md:flex-row flex-1 gap-4">
      <!-- Left Pane -->
      <div class="flex-[3] flex flex-col gap-4">
        <template v-if="isLoading">
          <CatalogSkeleton />
        </template>
        <template v-else>
          <CatalogTable />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CatalogSkeleton from "~/components/feature/catalog/CatalogSkeleton.vue";
import CatalogTable from "~/components/feature/catalog/CatalogTable.vue";

definePageMeta({
  breadcrumb: [{ label: "แคตตาล็อกสินค้า" }],
});

const isLoading = ref(true);
const note = ref("");

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
});
</script>

<style></style>
