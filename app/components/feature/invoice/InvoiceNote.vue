<template>
  <div class="mt-4">
    <Textarea
      v-model="note"
      placeholder="Type your message here."
      class="min-h-[120px]"
    />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update:note', value: string): void
}>()

const props = defineProps<{
  modelValue?: string
}>()

const note = ref(props.modelValue ?? '')

watch(note, (v) => {
  emit('update:note', v)
})
</script>
