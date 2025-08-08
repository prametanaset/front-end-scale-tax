<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between px-4 py-2">
      <h3 class="text-lg font-semibold">ตัวอย่าง</h3>
      <BaseButton @click="toggleExpand" variant="ghost">
        <ArrowRightFromLine class="w-4 h-4" />
      </BaseButton>
    </div>

    <div class="flex-1 min-h-0">
      <div class="h-full overflow-y-auto rounded-xl flex justify-center">
      <InvoicePaper />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InvoicePaper from './InvoicePaper.vue'
import { ArrowRightFromLine } from 'lucide-vue-next'
const { toggleExpand } = useRightPaneStore()
</script>