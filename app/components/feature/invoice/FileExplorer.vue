<template>
  <div class="space-y-3">
    <!-- Toolbar -->
    <div class="toolbar flex items-center justify-between gap-2">
      <BaseSearchInput place-holder="ค้นหาไฟล์" />
      <div class="flex gap-2 items-center">
        <BaseButton class="text-sm"
          ><Download /><span>ดาวน์โหลด</span></BaseButton
        >
        <BaseButton variant="icon" @click="showFileIcon = !showFileIcon">
          <List class="h-4 w-4" v-if="showFileIcon" />
          <Grid2x2 class="h-4 w-4" v-else />
        </BaseButton>
      </div>
    </div>

    <!-- Content -->
    <FeatureInvoiceFileExplorerGrid v-if="showFileIcon" />
    <!-- List View -->
    <FeatureInvoiceFileExplorerList v-else />
  </div>
</template>

<script lang="ts" setup>
import {
  Grid2x2,
  List,
  File,
  FileText,
  Download,
  CircleEllipsis,
  Share,
  EllipsisVertical,
} from "lucide-vue-next";
import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
import ScrollArea from "~/components/ui/scroll-area/ScrollArea.vue";
const showFileIcon = ref(false);
</script>
