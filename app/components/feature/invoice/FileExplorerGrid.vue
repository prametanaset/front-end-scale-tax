<template>
  <ScrollArea class="h-[calc(100vh-theme(spacing.40))] focus-visible:ring-0">
    <!-- ตัว container ที่เป็นพื้นที่ลาก-selection -->
    <div ref="gridWrap" class="relative select-none" @mousedown="onMouseDown">
      <!-- กรอบลาก (marquee box) -->
      <div
        v-show="isDragging"
        class="absolute pointer-events-none"
        :style="marqueeStyle"
      />

      <!-- Grid ไฟล์ -->
      <div
        ref="grid"
        class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-4 p-3"
      >
        <BaseCard
          v-for="(file, index) in files"
          :key="file.id"
          class="file-card relative p-0"
          :class="[
            'cursor-pointer rounded-xl transition',
            file.selected
              ? 'ring-2 ring-primary/70 bg-primary/5'
              : 'hover:bg-muted',
          ]"
          @click="onItemClick(index, $event)"
        >
          <ContextMenu>
            <ContextMenuTrigger as-child>
              <div class="flex flex-col items-center p-3 py-6">
                <!-- Checkbox มุมขวาบน -->
                <Checkbox
                  class="absolute top-2 right-2 z-10"
                  :model-value="file.selected"
                  @click.stop="toggleSingle(index)"
                />

                <!-- ไอคอน/รูป -->
                <div
                  class="w-12 h-12 flex items-center justify-center rounded-lg"
                >
                  <img
                    src="~/assets/img/etax-by-email.png"
                    :alt="file.fileName"
                    rule="img"
                  />
                </div>

                <!-- ชื่อไฟล์ -->
                <p class="mt-2 text-sm font-medium truncate w-full text-center">
                  {{ file.fileName }}
                </p>
                <!-- ขนาด -->
                <p class="text-xs text-muted-foreground">{{ file.size }}</p>
              </div>
            </ContextMenuTrigger>

            <ContextMenuContent class="w-54">
              <ContextMenuItem class="cursor-pointer"
                ><Eye /> เปิด</ContextMenuItem
              >
              <ContextMenuItem class="cursor-pointer"
                ><CircleEllipsis /> รายละเอียด</ContextMenuItem
              >
              <Separator />
              <ContextMenuItem class="cursor-pointer"
                ><Download /> ดาวน์โหลด</ContextMenuItem
              >
            </ContextMenuContent>
          </ContextMenu>
        </BaseCard>
      </div>
    </div>
  </ScrollArea>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
import { Eye, CircleEllipsis, Download } from "lucide-vue-next";

type FileItem = {
  id: number;
  fileName: string;
  type: string;
  size: string;
  selected: boolean;
};
const props = defineProps<{
  files: FileItem[];
}>();

const emit = defineEmits<{
  (e: "update:filter", value: string): void;
  (selectFIleCount: "selectFileCount", count: number): void;
  (e: "update:files", files: FileItem[]): void;
}>();

const files = ref(props.files);

const selectFileCount = computed(
  () => files.value.filter((f) => f.selected).length
);

watch(selectFileCount, (count) => {
  emit("selectFileCount", count);
});

const gridWrap = ref<HTMLElement | null>(null);
const grid = ref<HTMLElement | null>(null);

const startSelectedIndex = ref<number | null>(null);
const lastSelectedIndex = ref<number | null>(null);

function clearAll() {
  files.value.forEach((f) => (f.selected = false));
}

function selectOnly(index: number) {
  clearAll();
  if (files.value[index] !== undefined) {
    files.value[index].selected = true;
    lastSelectedIndex.value = index;
  }
}

function toggleSingle(index: number) {
  if (files.value[index] !== undefined)
    files.value[index].selected = !files.value[index].selected;
  lastSelectedIndex.value = index;
}

function selectRange(a: number, b: number, { additive = false } = {}) {
  const start = Math.min(a, b);
  const end = Math.max(a, b);
  if (!additive) clearAll();
  for (let i = start; i <= end; i++) {
    if (files.value[i] !== undefined) files.value[i]!.selected = true;
  }
}

function onItemClick(index: number, e: MouseEvent) {
  const additive = e.metaKey || e.ctrlKey;
  const withShift = e.shiftKey;

  if (withShift) {
    // ถ้าเพิ่งเริ่มกด shift ครั้งแรก -> เซ็ต start index
    if (startSelectedIndex.value === null) {
      startSelectedIndex.value = index;
    }
    // เลือกช่วงจาก start index -> index
    selectRange(startSelectedIndex.value, index, { additive });
    lastSelectedIndex.value = index;
  } else if (additive) {
    // toggle แบบเลือกเพิ่ม/ลบ
    toggleSingle(index);
    // อัพเดต start ให้ใช้เป็นฐานถ้า user จะ shift ต่อ
    startSelectedIndex.value = index;
    lastSelectedIndex.value = index;
  } else {
    // เลือกใหม่ทั้งหมด
    selectOnly(index);
    startSelectedIndex.value = index;
    lastSelectedIndex.value = index;
  }
}

/* -------- Shift+Drag (Marquee selection) ---------- */
const isDragging = ref(false);
const dragStart = reactive({ x: 0, y: 0 });
const dragEnd = reactive({ x: 0, y: 0 });
let containerRect: DOMRect | null = null;
let preSelected: Set<number> = new Set();

const marqueeStyle = computed(() => {
  const left = Math.min(dragStart.x, dragEnd.x);
  const top = Math.min(dragStart.y, dragEnd.y);
  const width = Math.abs(dragEnd.x - dragStart.x);
  const height = Math.abs(dragEnd.y - dragStart.y);
  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
  };
});

function getLocalPoint(e: MouseEvent) {
  if (!containerRect) return { x: 0, y: 0 };
  return {
    x: e.clientX - containerRect.left + gridWrap.value!.scrollLeft,
    y: e.clientY - containerRect.top + gridWrap.value!.scrollTop,
  };
}

function onMouseDown(e: MouseEvent) {
  // เริ่มลากเฉพาะเมื่อกดซ้าย + กด Shift
  if (e.button !== 0 || !e.shiftKey) return;

  containerRect = gridWrap.value!.getBoundingClientRect();
  const p = getLocalPoint(e);
  dragStart.x = p.x;
  dragStart.y = p.y;
  dragEnd.x = p.x;
  dragEnd.y = p.y;
  isDragging.value = true;

  // เก็บ selection เดิมไว้ ถ้าผู้ใช้กด Ctrl/Meta = additive
  preSelected = new Set(files.value.flatMap((f, i) => (f.selected ? [i] : [])));

  // ป้องกัน text selection
  e.preventDefault();
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp, { once: true });
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return;
  const p = getLocalPoint(e);
  dragEnd.x = p.x;
  dragEnd.y = p.y;
  updateMarqueeSelection(e);
}

function onMouseUp(e: MouseEvent) {
  if (!isDragging.value) return;
  isDragging.value = false;
  window.removeEventListener("mousemove", onMouseMove);

  // ตั้ง lastSelectedIndex เป็นไฟล์สุดท้ายที่โดนลาก (ถ้ามี)
  const last = files.value.findLastIndex((f) => f.selected);
  if (last !== -1) lastSelectedIndex.value = last;
}

function updateMarqueeSelection(e: MouseEvent) {
  if (!grid.value) return;

  const l = Math.min(dragStart.x, dragEnd.x);
  const r = Math.max(dragStart.x, dragEnd.x);
  const t = Math.min(dragStart.y, dragEnd.y);
  const b = Math.max(dragStart.y, dragEnd.y);

  const additive = e.ctrlKey || e.metaKey; // Shift+Ctrl = additive
  // เริ่มจาก selection เดิมถ้า additive, ไม่งั้นล้างก่อน
  if (!additive) files.value.forEach((f) => (f.selected = false));
  else files.value.forEach((f, i) => (f.selected = preSelected.has(i)));

  const cards = grid.value.querySelectorAll<HTMLElement>(".file-card");
  cards.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    // แปลงเป็นพิกัดท้องถิ่น container (รวม scroll)
    const x1 = rect.left - containerRect!.left + gridWrap.value!.scrollLeft;
    const y1 = rect.top - containerRect!.top + gridWrap.value!.scrollTop;
    const x2 = x1 + rect.width;
    const y2 = y1 + rect.height;

    const overlap = l < x2 && r > x1 && t < y2 && b > y1;
    if (overlap && files.value[i]) files.value[i].selected = true;
  });
}

onMounted(() => {
  // เผื่อคลิกนอกพื้นที่แล้ว mouseup ไม่เข้า container
  window.addEventListener("mouseup", onMouseUp);
});

onBeforeUnmount(() => {
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("mousemove", onMouseMove);
});
</script>
