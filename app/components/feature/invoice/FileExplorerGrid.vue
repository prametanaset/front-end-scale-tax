<template>
  <ScrollArea
    class="flex-1 overflow-hidden rounded-md h-[calc(100vh-theme(spacing.40))]"
  >
    <!-- Grid View -->
    <div
      class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-4"
    >
      <BaseCard
        v-for="file in 100"
        :key="file"
        class="hover:bg-muted cursor-pointer p-0 relative"
      >
        <ContextMenu>
          <ContextMenuTrigger as-child>
            <div
              class="flex flex-col items-center p-3 py-6 rounded-xl transition"
            >
              <!-- ไอคอน -->
              <Checkbox class="absolute top-2 right-2 z-10" role="checkbox" />
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

          <ContextMenuContent class="w-54">
            <ContextMenuItem class="cursor-pointer">
              <Eye />
              เปิด
            </ContextMenuItem>
            <ContextMenuItem class="cursor-pointer">
              <CircleEllipsis /> รายละเอียด
            </ContextMenuItem>
            <Separator />
            <ContextMenuItem class="cursor-pointer">
              <Download />
              ดาวน์โหลด
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </BaseCard>
    </div>
  </ScrollArea>
</template>

<script lang="ts" setup>
import {
  CircleEllipsis,
  CircleEllipsisIcon,
  Download,
  Eye,
} from "lucide-vue-next";
</script>

<style></style>
