<template>
  <div class="space-y-3">
    <!-- Toolbar -->
    <div class="toolbar flex items-center justify-between gap-2">
      <BaseSearchInput
        type="text"
        place-holder="ค้นหาไฟล์"
        v-model="searchQuery"
      />
      <div class="flex gap-4 items-center">
        <div
          :class="[
            selectFileCount === 0 ? 'opacity-0' : 'opacity-100',
            'transition-opacity',
          ]"
        >
          <p class="text-sm font-bold flex items-center gap-2">
            <BaseButton variant="ghost" @click="clearSelectFile"
              ><X
            /></BaseButton>
            เลือกไว้ {{ selectFileCount }} รายการ
          </p>
        </div>
        <BaseButton class="text-sm" :disabled="!canDownload"
          ><Download />
          <p>ดาวน์โหลด</p></BaseButton
        >
        <BaseButton variant="ghost" @click="showFileIcon = !showFileIcon">
          <List class="h-4 w-4" v-if="showFileIcon" />
          <Grid2x2 class="h-4 w-4" v-else />
        </BaseButton>
      </div>
    </div>

    <!-- Content -->
    <FeatureInvoiceFileExplorerGrid
      v-if="showFileIcon"
      :files="files"
      @select-file-count="handleFileSelect"
      @update:files="files = $event"
    />
    <!-- List View -->
    <FeatureInvoiceFileExplorerList
      v-else
      :files="files"
      @select-file-count="handleFileSelect"
      @update:files="files = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import { Grid2x2, List, Download, X } from "lucide-vue-next";
const showFileIcon = ref(true);
const selectFileCount = ref(0);
const searchQuery = ref("");
const canDownload = computed(() => selectFileCount.value > 0);

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

function handleFileSelect(count: number) {
  selectFileCount.value = count;
}

function clearSelectFile() {
  files.value.forEach((file) => (file.selected = false));
  selectFileCount.value = 0;
}
</script>
