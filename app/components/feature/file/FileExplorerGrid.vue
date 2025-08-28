<template>
  <ScrollArea class="h-[calc(dvh-theme(spacing.40))] p-2">
    <div class="text-center" v-if="files.length === 0">ไม่พบไฟล์</div>
    <!-- ตัว container ที่เป็นพื้นที่ลาก-selection -->
    <div
      v-else
      ref="gridWrap"
      class="relative select-none"
      @mousedown="onMouseDown"
      @click="onContainerClick"
    >
      <!-- กรอบลาก (marquee box) -->
      <div
        v-show="isDragging"
        class="absolute pointer-events-none"
        :style="marqueeStyle"
      />

      <!-- Grid ไฟล์ -->
      <div
        ref="grid"
        class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-2"
      >
        <BaseCard
          v-for="(file, index) in files"
          :key="file.id"
          class="file-card relative p-0"
          :class="[
            'cursor-pointer rounded-xl',
            file.selected
              ? 'bg-primary/8 border border-primary/20'
              : 'hover:bg-muted',
          ]"
          @click.stop="onItemClick(index, $event)"
        >
          <ContextMenu>
            <ContextMenuTrigger as-child>
              <div class="relative flex flex-col items-center p-3 py-6">
                <div class="absolute top-2 right-2">
                  <Checkbox
                    class="absolute top-2 right-2 z-10"
                    :model-value="file.selected"
                    @click.stop="toggleSingle(index)"
                  />
                </div>
                <!-- ไอคอน/รูป -->
                <div
                  class="w-12 h-12 flex items-center justify-center rounded-lg"
                >
                  <img
                    src="/img/etax-by-email.png"
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
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { Eye, CircleEllipsis, Download } from "lucide-vue-next";

type FileItem = {
  id: number;
  fileName: string;
  type: string;
  size: string;
  selected: boolean;
};

const props = defineProps<{ files: FileItem[] }>();

const emit = defineEmits<{
  (e: "update:filter", value: string): void;
  (e: "selectFileCount", count: number): void;
  (e: "update:files", files: FileItem[]): void;
}>();

const files = ref<FileItem[]>([]);
watch(
  () => props.files,
  (v) => (files.value = [...v]),
  { immediate: true }
);

const fileStore = useFileExplorerStore();
const selectFileCount = computed(() => files.value.filter(f => f.selected).length);
watch(selectFileCount, (c) => fileStore.setSelectFilesCount(c), { immediate: true });

const gridWrap = ref<HTMLElement | null>(null);
const grid = ref<HTMLElement | null>(null);

const startSelectedIndex = ref<number | null>(null);
const lastSelectedIndex = ref<number | null>(null);

function clearAll() {
  for (const f of files.value) f.selected = false;
}
function selectOnly(index: number) {
  clearAll();
  const f = files.value[index];
  if (f) {
    f.selected = true;
    lastSelectedIndex.value = index;
  }
}
function toggleSingle(index: number) {
  const f = files.value[index];
  if (f) f.selected = !f.selected;
  lastSelectedIndex.value = index;
}
function selectRange(a: number, b: number, { additive = false } = {}) {
  const start = Math.min(a, b);
  const end = Math.max(a, b);
  if (!additive) clearAll();
  for (let i = start; i <= end; i++) files.value[i] && (files.value[i]!.selected = true);
}

function onContainerClick(e: MouseEvent) {
  if (isDragging.value) return;
  const target = e.target as HTMLElement;
  if (target.closest(".file-card")) return;
  clearAll();
  startSelectedIndex.value = null;
  lastSelectedIndex.value = null;
}

function onItemClick(index: number, e: MouseEvent) {
  const additive = e.metaKey || e.ctrlKey;
  const withShift = e.shiftKey;

  if (withShift) {
    if (startSelectedIndex.value === null) startSelectedIndex.value = index;
    selectRange(startSelectedIndex.value, index, { additive });
    lastSelectedIndex.value = index;
  } else if (additive) {
    toggleSingle(index);
    startSelectedIndex.value = index;
    lastSelectedIndex.value = index;
  } else {
    selectOnly(index);
    startSelectedIndex.value = index;
    lastSelectedIndex.value = index;
  }
}

/* ============ Shift + Drag (Marquee) — O(N) → O(A) + rAF + Delta ============ */
const isDragging = ref(false);
const dragStart = reactive({ x: 0, y: 0 });
const dragEnd = reactive({ x: 0, y: 0 });
let containerRect: DOMRect | null = null;

// เก็บ selection ก่อนลาก (กรณี additive), และ selection ที่ apply ล่าสุดเพื่อทำ delta
let baseSelected = new Set<number>();
let lastApplied = new Set<number>();

const marqueeStyle = computed(() => {
  const left = Math.min(dragStart.x, dragEnd.x);
  const top = Math.min(dragStart.y, dragEnd.y);
  const width = Math.abs(dragEnd.x - dragStart.x);
  const height = Math.abs(dragEnd.y - dragStart.y);
  return { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px`, border: '1px dashed var(--border)', background: 'color-mix(in oklab, var(--primary) 12%, transparent)' };
});

function getLocalPoint(e: MouseEvent) {
  if (!containerRect || !gridWrap.value) return { x: 0, y: 0 };
  return {
    x: e.clientX - containerRect.left + gridWrap.value.scrollLeft,
    y: e.clientY - containerRect.top + gridWrap.value.scrollTop,
  };
}

/* -------- Metrics ของกริด (วัดครั้งเดียว/เมื่อ resize) -------- */
const metrics = reactive({
  cols: 1,
  gapX: 0,
  gapY: 0,
  cardW: 0,
  cardH: 0,
  gridLeft: 0, // พิกัดซ้ายบนของกริดใน local container
  gridTop: 0,
});

function computeGridMetrics() {
  if (!grid.value || !gridWrap.value) return;
  const cs = getComputedStyle(grid.value);
  const cols = cs.gridTemplateColumns.split(" ").filter(Boolean).length || 1;
  const gapX = parseFloat(cs.columnGap || "0") || 0;
  const gapY = parseFloat(cs.rowGap || "0") || 0;

  // วัดการ์ดใบแรก
  const firstCard = grid.value.querySelector<HTMLElement>(".file-card");
  const cardW = firstCard?.offsetWidth ?? 0;
  const cardH = firstCard?.offsetHeight ?? 0;

  const gRect = grid.value.getBoundingClientRect();
  const cRect = gridWrap.value.getBoundingClientRect();
  const gridLeft = gRect.left - cRect.left + gridWrap.value.scrollLeft;
  const gridTop = gRect.top - cRect.top + gridWrap.value.scrollTop;

  metrics.cols = Math.max(1, cols);
  metrics.gapX = gapX;
  metrics.gapY = gapY;
  metrics.cardW = cardW;
  metrics.cardH = cardH;
  metrics.gridLeft = gridLeft;
  metrics.gridTop = gridTop;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function xToCol(x: number) {
  const dx = x - metrics.gridLeft;
  const step = metrics.cardW + metrics.gapX;
  return Math.floor(dx / (step || 1));
}
function yToRow(y: number) {
  const dy = y - metrics.gridTop;
  const step = metrics.cardH + metrics.gapY;
  return Math.floor(dy / (step || 1));
}

// rAF throttle
let rafPending = false;
let lastEventForRAF: MouseEvent | null = null;

function onMouseDown(e: MouseEvent) {
  if (e.button !== 0 || !e.shiftKey) return;
  if (!gridWrap.value) return;

  containerRect = gridWrap.value.getBoundingClientRect();
  computeGridMetrics();

  const p = getLocalPoint(e);
  dragStart.x = p.x;
  dragStart.y = p.y;
  dragEnd.x = p.x;
  dragEnd.y = p.y;

  isDragging.value = true;

  // เก็บ selection เดิม (สำหรับ additive เมื่อกด Ctrl/Meta พร้อม Shift)
  baseSelected = new Set<number>();
  files.value.forEach((f, i) => f.selected && baseSelected.add(i));

  // เริ่มจากสถานะที่ apply ล่าสุด = selection ปัจจุบัน
  lastApplied = new Set(baseSelected);

  e.preventDefault();
  window.addEventListener("mousemove", onMouseMove, { passive: true });
  window.addEventListener("mouseup", onMouseUp, { once: true });
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return;
  const p = getLocalPoint(e);
  dragEnd.x = p.x;
  dragEnd.y = p.y;

  lastEventForRAF = e;
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      if (lastEventForRAF) {
        updateMarqueeSelection(lastEventForRAF);
        lastEventForRAF = null;
      }
    });
  }
}

function onMouseUp(e: MouseEvent) {
  if (!isDragging.value) return;
  isDragging.value = false;
  window.removeEventListener("mousemove", onMouseMove);

  // ตั้ง lastSelectedIndex เป็นใบสุดท้ายที่ยังถูกเลือก
  for (let i = files.value.length - 1; i >= 0; i--) {
    if (files.value[i]?.selected) {
      lastSelectedIndex.value = i;
      break;
    }
  }

  // sync counter อีกครั้งหลังลากจบ
  fileStore.setSelectFilesCount(selectFileCount.value);
}

// อัปเดต selection แบบ O(A) + Delta
function updateMarqueeSelection(e: MouseEvent) {
  if (!grid.value || !gridWrap.value) return;

  const l = Math.min(dragStart.x, dragEnd.x);
  const r = Math.max(dragStart.x, dragEnd.x);
  const t = Math.min(dragStart.y, dragEnd.y);
  const b = Math.max(dragStart.y, dragEnd.y);

  // แปลงพิกัด → ช่วงคอลัมน์/แถว
  let c1 = xToCol(l), c2 = xToCol(r);
  let r1 = yToRow(t), r2 = yToRow(b);

  const total = files.value.length;
  const cols = metrics.cols;
  const rows = Math.ceil(total / cols);

  c1 = clamp(c1, 0, cols - 1);
  c2 = clamp(c2, 0, cols - 1);
  r1 = clamp(r1, 0, rows - 1);
  r2 = clamp(r2, 0, rows - 1);

  if (c1 > c2) [c1, c2] = [c2, c1];
  if (r1 > r2) [r1, r2] = [r2, r1];

  const rectSet = new Set<number>();
  for (let row = r1; row <= r2; row++) {
    const rowStart = row * cols;
    for (let col = c1; col <= c2; col++) {
      const idx = rowStart + col;
      if (idx < total) rectSet.add(idx);
    }
  }

  const additive = e.ctrlKey || e.metaKey; // Shift+Ctrl/Meta = additive
  const target = new Set<number>(additive ? baseSelected : []);
  for (const i of rectSet) target.add(i);

  // Delta apply: ปรับเฉพาะที่เปลี่ยน
  for (const i of target) {
    if (!lastApplied.has(i)) files.value[i] && (files.value[i]!.selected = true);
  }
  for (const i of lastApplied) {
    if (!target.has(i)) files.value[i] && (files.value[i]!.selected = false);
  }
  lastApplied = target;
}

onMounted(() => {
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("resize", computeGridMetrics);
  // คอยวัดใหม่เมื่อมีการ์ดเกิดขึ้นครั้งแรก
  watch(
    () => files.value.length,
    () => computeGridMetrics(),
    { immediate: true }
  );
});
onBeforeUnmount(() => {
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("resize", computeGridMetrics);
});
</script>

