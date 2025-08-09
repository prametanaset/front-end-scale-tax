<template>
  <Card  :class="cn('rounded-lg shadow-none', props.class)"
>
    <slot />
  </Card>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

</script>
