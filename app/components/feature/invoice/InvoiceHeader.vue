<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 auto-rows-min">
    <div v-for="i in 4" :key="i" class="flex items-center justify-center h-10">
      <Input type="text" :placeholder="`Field ${i}`" class="w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
