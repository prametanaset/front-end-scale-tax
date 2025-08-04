<template>
  <div class="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-theme(spacing.20))]">
    <div class="grid auto-rows-min gap-4 md:grid-cols-4">
      <div class="aspect-video rounded-xl bg-muted/50">
        <chart-line
          :series="data"
          theme="success"
          class="aspect-video"
          height="h-14 md:h-14"
          width="w-full "
        />
      </div>
      <div class="aspect-video rounded-xl bg-muted/50" />
      <div class="aspect-video rounded-xl bg-muted/50" />
      <div class="aspect-video rounded-xl bg-muted/50" />
    </div>
    <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  breadcrumb: [
    { label: 'รายการใบแจ้งหนี้' }
  ]
})

const data = [
  {
    name: 'Sales',
    data: [200, 600, 100, 400, 300, 400, 50]
  }
]
</script>

<style>

</style>