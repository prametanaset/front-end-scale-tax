<template>
  <ScrollArea class="max-h-[calc(100vh-theme(spacing.40))] pt-2">
    <BaseDataTable
      :data="files"
      :column-name="colName"
      div-classname="min-h-0 max-h-[calc(100vh-theme(spacing.20)-3rem)]"
    ></BaseDataTable>
  </ScrollArea>
</template>

<script lang="ts" setup>
type FileItem = {
  id: number;
  fileName: string;
  type: string;
  size: string;
  selected: boolean;
};

const colName = {
  id: "--hide--",
  fileName: "ชื่อไฟล์",
  type: "ประเภทไฟล์",
  size: "ขนาด",
  selected: "--hide--",
};

const props = defineProps<{
  files: FileItem[];
}>();

const emit = defineEmits<{
  (e: "update:filter", value: string): void;
  (selectFIleCount: "selectFileCount", count: number): void;
  (e: "update:files", files: FileItem[]): void;
}>();

const files = ref<FileItem[]>([]);

watch(
  () => props.files,
  (newVal) => {
    files.value = [...newVal]; // sync เมื่อ props เปลี่ยน
  },
  { immediate: true }
);
</script>

<style></style>
