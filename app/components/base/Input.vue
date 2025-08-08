<template>
  <div class="w-full">
    <Label v-if="label" :for="id" class="block text-sm font-medium mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </Label>

    <div class="relative flex items-center w-full">
      <slot name="prefix" />

      <Input
        :id="id"
        v-bind="inputProps"
        :class="cn('shadow-none', computedClass)"
        :disabled="disabled"
        :placeholder="placeholder"
        :type="type"
        :aria-invalid="hasError ? 'true' : 'false'"
        :aria-describedby="hasError ? errorId : undefined"
        v-model="innerValue"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />

      <slot name="suffix" />
    </div>

    <p v-if="hasError" :id="errorId" class="mt-1 text-xs text-red-600" role="alert">
      {{ errorMessage }}
    </p>
    <p v-else-if="description" class="mt-1 text-xs text-muted-500">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { cn } from '~/lib/utils'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  description: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
  type: { type: String, default: 'text' },
  size: { type: String as () => 'sm' | 'md' | 'lg', default: 'md' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  id: { type: String, default: () => `baseinput-${nanoid(6)}` },
  inputProps: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const innerValue = toRef(props, 'modelValue')
watch(innerValue, (v) => emit('update:modelValue', v))

const hasError = computed(() => !!props.errorMessage)
const errorId = `${props.id}-error`

const computedClass = computed(() => {
  const sizeMap: Record<string, string> = {
    sm: 'text-sm px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3',
  }
  return sizeMap[props.size] || sizeMap.md
})
</script>
