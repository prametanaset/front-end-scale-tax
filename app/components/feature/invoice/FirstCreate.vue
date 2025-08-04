<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <div
      class="rounded-xl bg-muted acpect-squre w-20 h-20 flex items-center justify-center"
    >
      <Newspaper class="size-8" />
    </div>
    <h2 class="text-2xl font-semibold">Create New Invoice</h2>
    <NuxtLink to="/invoices/create">
      <BaseButton variant="default">
        <Plus class="w-4 h-4" />
        Create
      </BaseButton>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { Plus, Newspaper } from "lucide-vue-next";
</script>

<style></style>
