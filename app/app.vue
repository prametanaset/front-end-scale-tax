<template>
  <NuxtLayout>
    <NuxtPage />
    <NuxtPwaManifest />
    <Toaster class="pointer-events-auto" />
  </NuxtLayout>
</template>

<script setup lang="ts"></script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
