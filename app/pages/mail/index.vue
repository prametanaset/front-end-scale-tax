<template>
  <div
    class="relative flex flex-1 flex-col min-h-[calc(100dvh-theme(spacing.20))] overflow-hidden"
  >
      <FeatureMailLogin />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  breadcrumb: [{ label: "อีเมล" }],
});
</script>

