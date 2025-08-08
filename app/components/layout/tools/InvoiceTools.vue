<template>
  <div class="flex items-center gap-4">
     <!-- <BaseSelect
      v-model="docType"
      :options="DOCUMENT_TYPES"
      placeholder="เลือกประเภทเอกสาร"
      @update:modelValue="val => docType = val"
    /> -->
    <Toggle
      aria-label="Toggle preview"
      class="cursor-pointer"
      :modelValue="isRightExpanded"
      @click="toggleExpand"
    >
      <Eye class="w-4 h-4" />
      ตัวอย่าง
    </Toggle>
    <!-- <BaseButton class="rounded-md" variant="ghost" @click="toggleExpand">
      <Eye class="w-4 h-4" />
      ตัวอย่าง
    </BaseButton> -->
    <BaseButton class="rounded-md" variant="secondary">
      <Plus class="w-4 h-4" />
      สร้าง
    </BaseButton>
    <BaseButton class="rounded-md">
      <Send class="w-4 h-4" />  
      สร้างและส่ง
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
import { Plus, Send, Eye } from 'lucide-vue-next'
const paneStore = useRightPaneStore();
const { isRightExpanded } = storeToRefs(paneStore);
const { toggleExpand } = paneStore;

const docType = ref('invoice')

const DOCUMENT_TYPES = [
  { value: 'invoice', label: 'Invoice' },
  { value: 'credit_note', label: 'Credit Note' },
  { value: 'debit_note', label: 'Debit Note' },
]

const grouped = [
  {
    groupLabel: 'Primary',
    items: [
      { value: 'invoice', label: 'Invoice' },
      { value: 'debit_note', label: 'Debit Note' },
    ],
  },
  {
    groupLabel: 'Adjustments',
    items: [{ value: 'credit_note', label: 'Credit Note' }],
  },
]

watch(docType, v => {
  console.log('parent docType', v)
})
</script>

<style>

</style>