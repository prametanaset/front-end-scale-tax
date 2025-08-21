<template>
  <Dialog :open="modelValue" @update:open="onUpdateOpen">
    <DialogTrigger as-child>
      <slot name="trigger">
        <BaseButton variant="default" :class="bgButton" v-if="showButton">
          {{ text }}
        </BaseButton>
      </slot>
    </DialogTrigger>

    <DialogContent class="px-0">
      <DialogHeader class="px-6">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>

      <slot name="content" />

      <DialogFooter class="px-6">
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean;
  text?: string;
  title?: string;
  description?: string;
  bgButton?: string;
  showButton?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

function onUpdateOpen(value: boolean) {
  emit("update:modelValue", value);
}
</script>
