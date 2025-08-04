<template>
  <div class="space-y-6">
    <!-- summary grid skeleton -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 auto-rows-min">
      <div v-for="i in 4" :key="i" class="flex items-center justify-center h-10">
        <Skeleton class="rounded-xl w-full h-full" />
      </div>
    </div>

    <!-- cards skeleton -->
    <div class="rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <Skeleton class="rounded-xl h-10 w-1/3" />
        <Skeleton class="rounded-xl min-h-[120px]" />
      </div>
      <div class="flex flex-col gap-2">
        <Skeleton class="rounded-xl h-10 w-1/3" />
        <Skeleton class="rounded-xl min-h-[120px]" />
      </div>
    </div>

    <!-- table + note skeleton -->
    <div class="flex flex-col gap-4">
      <Skeleton class="rounded-xl h-20" />
      <Skeleton class="rounded-xl h-20" />
    </div>
  </div>
</template>

<script setup lang="ts">
// ไม่มี props เพราะแสดงเมื่อ loading เท่านั้น
</script>
