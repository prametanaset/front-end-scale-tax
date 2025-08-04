<template>
  <Card  :class="cn('rounded-lg shadow-none', props.class)"
>
    <slot />
  </Card>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()


</script>
