<!-- components/BaseSelect.vue -->
<template>
  <div class="inline-block">
    <Select v-model="localValue">
      <SelectTrigger :class="triggerClass" :aria-label="ariaLabel">
        <SelectValue :placeholder="placeholder || 'Select'" />
      </SelectTrigger>

      <SelectContent>
        <!-- Grouped options -->
        <template v-if="groupedOptions">
          <template v-for="group in groupedOptions" :key="group.groupLabel">
            <SelectGroup>
              <SelectLabel>{{ group.groupLabel }}</SelectLabel>
              <template v-for="opt in group.items" :key="opt.value">
                <SelectItem :value="opt.value" :disabled="opt.disabled">
                  {{ opt.label }}
                </SelectItem>
              </template>
            </SelectGroup>
          </template>
        </template>

        <!-- Flat options -->
        <template v-else>
          <template v-for="opt in flatOptions" :key="opt.value">
            <SelectItem :value="opt.value" :disabled="opt.disabled">
              {{ opt.label }}
            </SelectItem>
          </template>
        </template>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Option = { value: string; label: string; disabled?: boolean }
type GroupedOption = { groupLabel: string; items: Option[] }

const props = defineProps<{
  modelValue: string
  options: Option[] | GroupedOption[]
  placeholder?: string
  triggerClass?: string
  ariaLabel?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

// 1) local state
const localValue = ref(props.modelValue)

// 2) sync parent -> local
watch(
  () => props.modelValue,
  (v) => {
    if (v !== localValue.value) localValue.value = v
  }
)

// 3) sync local -> parent
watch(localValue, (v) => {
  if (v !== props.modelValue) emit('update:modelValue', v)
})

// 4) type guard + computed for grouped/flat
function isGroupedOptions(
  opts: Option[] | GroupedOption[]
): opts is GroupedOption[] {
  return Array.isArray(opts) &&
    opts.length > 0 &&
    'groupLabel' in (opts[0] as any)
}

const groupedOptions = computed<GroupedOption[] | undefined>(() => {
  return isGroupedOptions(props.options) ? props.options : undefined
})

const flatOptions = computed<Option[]>(() => {
  return isGroupedOptions(props.options)
    ? props.options.flatMap(g => g.items)
    : (props.options as Option[])
})
</script>
