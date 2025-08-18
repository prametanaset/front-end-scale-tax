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
    <ScrollArea
      v-if="showFileIcon"
      class="flex-1 overflow-hidden rounded-md h-[calc(100vh-theme(spacing.40))]"
    >
      <!-- Grid View -->
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        <BaseCard
          v-for="file in 100"
          :key="file"
          class="hover:bg-muted cursor-pointer"
        >
          <ContextMenu>
            <ContextMenuTrigger as-child>
              <div class="flex flex-col items-center p-3 rounded-xl transition">
                <!-- ไอคอน -->
                <div
                  class="w-12 h-12 flex items-center justify-center rounded-lg"
                >
                  <!-- <FileText class="w-8 h-8" /> -->
                  <img
                    src="~/assets/img/pdf.png"
                    :alt="`TS27042568_INV-${file}.pdf`"
                  />
                </div>
                <!-- ชื่อไฟล์ -->
                <p class="mt-2 text-sm font-medium truncate w-full text-center">
                  {{ `TS27042568_INV-${file}.pdf` }}
                </p>
                <!-- ขนาด -->
                <p class="text-xs text-muted-foreground">
                  {{ Math.floor(Math.random() * 10).toFixed(1) + 1 }} MB
                </p>
              </div>
            </ContextMenuTrigger>

            <ContextMenuContent class="w-64">
              <ContextMenuItem inset class="cursor-pointer">
                เปิด
                <ContextMenuShortcut></ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem inset class="cursor-pointer">
                รายละเอียด
                <ContextMenuShortcut></ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem inset class="cursor-pointer">
                ดาวน์โหลด
                <ContextMenuShortcut><Download /></ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </BaseCard>
      </div>
    </ScrollArea>

    <!-- List View -->

    <ScrollArea
      v-else
      class="flex-1 overflow-hidden rounded-md h-[calc(100vh-theme(spacing.40))]"
    >
      <Table class="text-sm relative" div-classname="overflow-clip">
        <TableHeader class="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead class="text-left py-2 px-4"><Checkbox /></TableHead>
            <TableHead class="text-left py-2 px-4">ชื่อไฟล์</TableHead>
            <TableHead class="text-left py-2 px-4">ประเภท</TableHead>
            <TableHead class="text-end py-2 px-4">ขนาด</TableHead>
            <TableHead class="text-center py-2 px-4"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="file in 30"
            :key="file"
            class="group hover:bg-muted cursor-pointer"
          >
            <TableCell class="py-2 px-4"><Checkbox /></TableCell>
            <TableCell class="py-2 px-4 flex items-center gap-2">
              <img
                class="w-4 h-4"
                src="~/assets/img/pdf.png"
                :alt="`TS27042568_INV-${file}.pdf`"
              />
              {{ `TS27042568_INV-${file}` }}
            </TableCell>
            <TableCell class="py-2 px-4">PDF</TableCell>
            <TableCell class="py-2 px-4 text-end"
              >{{ Math.floor(Math.random() * 10).toFixed(1) + 1 }} MB</TableCell
            >
            <TableCell class="py-2">
              <div class="flex items-center justify-center">
                <div
                  class="opacity-0 group-hover:opacity-100 flex items-center justify-center mr-2"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <Download class="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>ดาวน์โหลด</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <EllipsisVertical class="w-4 h-4" />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </ScrollArea>
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
const showFileIcon = ref(true);
</script>
