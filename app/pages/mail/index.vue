<template>
  <div
    class="relative flex flex-1 flex-col p-4 gap-4 md:min-h-[calc(100vh-theme(spacing.20))] min-h-[calc(100vh-4rem)] overflow-hidden"
  >
      <FeatureMailLogin />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  breadcrumb: [{ label: "อีเมล" }],
});
</script>

