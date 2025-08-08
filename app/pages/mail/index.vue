<template>
  <div class="flex flex-1 flex-col gap-4 p-4">
    <Skeleton
      v-for="i in 24"
      :key="i"
      class="aspect-video h-12 w-full rounded-lg"
    />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  breadcrumb: [
    { label: 'อีเมล' }
  ]
})
</script>

<style>

</style>