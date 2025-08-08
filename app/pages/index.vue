<template>
  <div class="flex flex-1 flex-col gap-4 p-4 min-h-[calc(100vh-theme(spacing.20))]">
    <!-- Top Grid -->
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
      <div class="aspect-video rounded-xl bg-muted/50"></div>
      <div class="aspect-video rounded-xl bg-muted/50"></div>
      <div class="aspect-video rounded-xl bg-muted/50"></div>
    </div>

    <!-- Bottom Grid -->
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
      <div class="md:col-span-2 w-full rounded-xl bg-muted/50 h-full">c</div>
      <div class="w-full rounded-xl bg-muted/50 h-full">
        <feature-dashboard-quick-action />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Docs", href: "/" },
    { label: "Building Your Application" },
  ],
});
</script>
