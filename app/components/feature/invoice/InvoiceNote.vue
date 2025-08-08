<template>
    <Textarea
      v-model="note"
      placeholder="Type your message here."
      :class="cn('min-h-[120px]', props.class)"
    />
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const emit = defineEmits<{
  (e: 'update:note', value: string): void
}>()

const props = defineProps<{
  modelValue?: string
  class?: HTMLAttributes['class']
}>()

const note = ref(props.modelValue ?? '')

watch(note, (v) => {
  emit('update:note', v)
})
</script>
