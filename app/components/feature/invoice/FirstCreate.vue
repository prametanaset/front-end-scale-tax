<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <div
      class="rounded-2xl shadow-md bg-muted acpect-squre w-16 h-16 flex items-center justify-center"
    >
      <Newspaper class="size-8" />
    </div>
    <h2 class="text-2xl font-semibold">Create New Invoice</h2>
      <BaseButton to="/invoices/create">
        <Plus class="w-4 h-4" />
        Create
      </BaseButton>
  </div>
</template>

<script lang="ts" setup>
import { Plus, Newspaper } from "lucide-vue-next";
</script>

<style></style>
