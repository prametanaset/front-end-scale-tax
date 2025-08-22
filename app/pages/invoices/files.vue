<template>
  <div class="flex flex-1 flex-col gap-4 h-[calc(100vh-theme(spacing.20))]">
    <!-- <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> -->
    <div class="flex flex-col md:flex-row flex-1 gap-4">
      <!-- Left Pane -->
      <div class="flex-[3] flex flex-col gap-4">
        <template v-if="isLoading">
          <!-- <CustomerSkeleton /> -->
        </template>
        <template v-else>
          <FeatureFileExplorer />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  breadcrumb: [{ label: "ไฟล์" }],
});
const isLoading = ref(false);
</script>

<style></style>
