<template>
  <div class="space-y-3">
    <!-- Content -->
    <FeatureFileExplorerGrid
      ref="modalRef"
      v-if="fileStore.showView === 'grid'"
      :files="filesShowDisplay"
      @select-file-count="handleFileSelect"
      @update:files="files = $event"
    />
    <!-- List View -->
    <FeatureFileExplorerList
      v-if="fileStore.showView === 'list'"
      :files="filesShowDisplay"
      @select-file-count="handleFileSelect"
      @update:files="files = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { useTemplateRef } from "vue";

const modalRef = useTemplateRef<HTMLElement>("modalRef");

onClickOutside(modalRef, (event) => {
  clearSelectFile();
});

const selectFileCount = ref(0);
const fileStore = useFileExplorerStore();
const toolsStore = useToolsStore();

type FileItem = {
  id: number;
  fileName: string;
  type: string;
  size: string;
  selected: boolean;
};

const files = ref<FileItem[]>(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    fileName: `TS27042568_INV-${i + 1}.pdf`,
    type: "PDF",
    size: `${(Math.random() * 9 + 1).toFixed(1)} MB`,
    selected: false,
  }))
);

// ✅ คำนวณไฟล์ที่ต้องแสดง
const filesShowDisplay = computed(() => {
  const query = toolsStore.query?.toLowerCase() ?? "";
  if (!query) return files.value;

  var result = files.value.filter((file) =>
    file.fileName.toLowerCase().includes(query)
  );
  return result;
});

function handleFileSelect(count: number) {
  selectFileCount.value = count;
  fileStore.setSelectFilesCount(count);
}

function clearSelectFile() {
  files.value.forEach((file) => (file.selected = false));
  selectFileCount.value = 0;
}
</script>
