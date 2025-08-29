<template>
  <div class="flex justify-end w-full">
    <div class="sm:hidden">
      <Popover>
        <PopoverTrigger>
          <BaseButton variant="icon"
            ><Search class="size-6 text-muted-foreground"
          /></BaseButton>
        </PopoverTrigger>
        <PopoverContent class="left- w-screen">
          <div class="relative w-full max-w-md items-center">
            <Input
              name="input"
              :type="props.type"
              :class="['pl-10 truncate overflow-hidden w-full']"
              :placeholder="isMobile ? 'ค้นหา' : placeHolder"
              v-model="qLocal"
            />
            <span
              class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
            >
              <Search class="size-6 text-muted-foreground" />
            </span>
            <span
              v-if="qLocal !== ''"
              @click="qLocal = ''"
              class="absolute end-0 inset-y-0 flex items-center justify-center px-2 cursor-pointer hover:bg-gray-500/20 rounded-2xl"
            >
              <X class="size-6 text-muted-foreground" />
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    <div class="relative w-full max-w-md items-center hidden sm:block">
      <Input
        name="input"
        :type="props.type"
        :class="[
          'pl-10 truncate overflow-hidden',
          isMobile ? 'w-[90vw]' : ' max-w-md',
        ]"
        :placeholder="isMobile ? 'ค้นหา' : placeHolder"
        v-model="qLocal"
      />
      <span
        class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
      >
        <Search class="size-6 text-muted-foreground" />
      </span>
      <span
        v-if="qLocal !== ''"
        @click="qLocal = ''"
        class="absolute end-0 inset-y-0 flex items-center justify-center px-2 cursor-pointer hover:bg-gray-500/20 rounded-2xl"
      >
        <X class="size-6 text-muted-foreground" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { Search, X } from "lucide-vue-next";
import { useMediaQuery } from "@vueuse/core";

const props = defineProps<{
  placeHolder?: string;
  modelValue?: string;
  type?: "text" | "number";
}>();

const emit = defineEmits<{
  (e: "update:model-value", value: string): void;
}>();

const isMobile = useMediaQuery("(max-width: 660px)");

const screenSize = computed(() => {
  if (isMobile.value) return "mobile";
  // if (isTablet.value) return "tablet";
  return "desktop";
});

const qLocal = ref(props.modelValue ?? "");

watch(qLocal, (val) => emit("update:model-value", val));

// sync เมื่อ parent เปลี่ยน
watch(
  () => props.modelValue,
  (val) => {
    if (val !== qLocal.value) qLocal.value = val ?? "";
  }
);
</script>
