<!-- BaseDialog.vue -->
<template>
  <Dialog :open="modelValue" @update:open="emit('update:modelValue', $event)">
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
