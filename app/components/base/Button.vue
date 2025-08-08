<template>
  <Button
    :type="type"
    :variant="variant"
    :disabled="disabled"
    :class="cn('rounded-full cursor-pointer', customeClass)"
    @click="onClick">
    <slot />
  </Button>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

const props = defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'link' | 'secondary' | 'icon'
  disabled?: boolean
  customeClass?: string
  onClick?: (event: MouseEvent) => void
}>()

function onClick(event: MouseEvent) {
  if (props.onClick) {
    props.onClick(event)
  }
}
</script>

<style>

</style>