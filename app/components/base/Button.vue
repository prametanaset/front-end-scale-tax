<template>
  <!-- มี to: เรนเดอร์เป็นลิงก์ด้วย asChild -->
  <Button
    v-if="to"
    aria-label="button"
    :variant="variant"
    :disabled="disabled"
    :class="mergedClass"
    v-bind="restAttrs"
    asChild
  >
    <NuxtLink :to="to">
      <slot />
    </NuxtLink>
  </Button>

  <!-- ปกติ: เป็นปุ่ม -->
  <Button
    v-else
    :type="type"
    aria-label="button"
    :variant="variant"
    :disabled="disabled"
    :class="mergedClass"
    v-bind="restAttrs"
    @click="$emit('click', $event)"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import { cn } from "~/lib/utils";

// ไม่ให้ attrs ไปติดกับ root <template> เอง
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    to?: string;
    type?: "button" | "submit" | "reset";
    variant?:
      | "default"
      | "outline"
      | "ghost"
      | "destructive"
      | "link"
      | "secondary"
      | "icon";
    disabled?: boolean;
  }>(),
  {
    type: "button",
    variant: "default",
    disabled: false,
  }
);

defineEmits<{
  (e: "click", ev: MouseEvent): void;
}>();

const attrs = useAttrs();

// ดึง class จาก attrs แล้ว merge กับค่าเริ่มต้นให้เหมือนกันทั้ง SSR/Client
const mergedClass = computed(() =>
  cn("rounded-full cursor-pointer", (attrs.class as string) || "")
);

// ส่งต่อ attrs อื่น ๆ ยกเว้น class (เพราะจัดการเองแล้ว)
const restAttrs = computed(() => {
  const { class: _c, ...rest } = attrs as Record<string, unknown>;
  return rest;
});

const { to, type, variant, disabled } = toRefs(props);
</script>
