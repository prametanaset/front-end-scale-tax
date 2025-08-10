<!-- BaseDialog.vue -->
<template>
  <Dialog :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)">
    <DialogTrigger as-child>
      <slot name="trigger">
        <Button variant="outline" :class="bgButton" v-if="showButton">
          {{ props.text }}
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[70vw]">
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
        <DialogDescription>
          {{ props.description }}
        </DialogDescription>
      </DialogHeader>
      <slot name="content" />
      <DialogFooter>
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  text?: string;
  title?: string;
  description?: string;
  bgButton?: string;
  showButton?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>
