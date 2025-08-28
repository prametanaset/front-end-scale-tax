<template>
  <div class="space-y-2">
    <div class="flex justify-end w-full">
      <slot name="tabs" />
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <BaseButton variant="outline" class="ml-auto">
            <Columns3Cog /> <ChevronDown class="ml-2 h-4 w-4" />
          </BaseButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table
              .getAllColumns()
              .filter((c) => c.getCanHide())"
            :key="column.id"
            class="capitalize cursor-pointer"
            :model-value="column.getIsVisible()"
            @update:model-value="(value) => column.toggleVisibility(!!value)"
          >
            {{ column.columnDef.header }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <Table
      :class="cn('relative w-full overflow-auto')"
      :div-classname="props.divClassname"
    >
      <TableHeader class="sticky top-0 z-10 bg-background">
        <TableRow
          v-for="(headerGroup, index) in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned()"
            :class="
              cn({ 'sticky bg-background z-10': header.column.getIsPinned() })
            "
            :style="{
              ...(header.column.getIsPinned() === 'left'
                ? { left: getStickyLeftValue(header.column.id) }
                : header.column.getIsPinned() === 'right'
                ? { right: '0px' }
                : {}),
              ...(header.column.id === 'name'
                ? { borderRight: '2px solid red-500' }
                : {}),
            }"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
      >
        <template v-if="table.getRowModel().rows?.length">
          <template
            v-for="(row, index) in table.getRowModel().rows"
            :key="row.id"
          >
            <TableRow
              :data-state="row.getIsSelected() && 'selected'"
              :data-index="index"
              @click="handleRowClick($event, index)"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :data-pinned="cell.column.getIsPinned()"
                :class="
                  cn({
                    'sticky bg-background z-10': cell.column.getIsPinned(),
                  })
                "
                :style="
                  cell.column.getIsPinned() === 'left'
                    ? { left: getStickyLeftValue(cell.column.id) }
                    : cell.column.getIsPinned() === 'right'
                    ? { right: '0px' }
                    : {}
                "
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
            <TableRow
              v-if="row.getIsExpanded()"
              @click="handleRowClick($event, index)"
            >
              <TableCell :colspan="row.getAllCells().length">
                {{ JSON.stringify(row.original) }}
              </TableCell>
            </TableRow>
          </template>
        </template>

        <TableRow v-else>
          <TableCell :colspan="columns.length" class="h-24 text-center">
            ไม่พบข้อมูลการค้นหา {{ toolsStore.query ? toolsStore.query : "" }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ExpandedState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/vue-table";
import { cn, valueUpdater } from "~/lib/utils";
import Checkbox from "../ui/checkbox/Checkbox.vue";
import { ChevronDown, Columns3Cog } from "lucide-vue-next";

const props = defineProps<{
  divClassname?: string;
  data: any;
  columnName?: Record<string, string>;
  action?: Component;
  stickyCol?: { columnId: string; width: number }[];
}>();

const toolsStore = useToolsStore();

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const expanded = ref<ExpandedState>({});
const columnPinning = ref<ColumnPinningState>({});
const columnHelper = createColumnHelper<Record<string, any>>();
const rowSelection = ref<RowSelectionState>({});
const dataRow = ref(props.data);

const columns = computed(() => {
  if (!props.data || props.data.length === 0) return [];

  const keys = Object.keys(props.data[0]);

  // ✅ filter keys ที่ไม่ใช่ "--hide--"
  const filteredKeys = keys.filter(
    (key) => props.columnName?.[key] !== "--hide--"
  );

  const dynamicCols = filteredKeys.map((key) => {
    const stickyConfig = props.stickyCol?.find((c) => c.columnId === key);
    const customName = props.columnName?.[key];

    return columnHelper.accessor(key, {
      header: customName || key.replace(/_/g, " ").toUpperCase(),
      cell: (info) => {
        const value = info.getValue();
        return typeof value === "object" ? JSON.stringify(value) : value ?? "-";
      },
      enableSorting: true,
      enableHiding: true,
      size: stickyConfig ? stickyConfig.width : undefined,
    });
  });

  // ✅ Checkbox Column
  const selectCol = columnHelper.display({
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        modelValue:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row, rowIndex }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean) =>
          handleCheckboxClick(rowIndex, value),
        ariaLabel: "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  });

  const actionCol = props.action
    ? columnHelper.display({
        id: "actions",
        header: "จัดการ",
        cell: ({ row }) =>
          h(props.action as any, {
            customer: row.original, // ✅ ส่ง data ของ row ไปที่ component
          }),
        enableSorting: false,
        enableHiding: false,
      })
    : null;

  return actionCol
    ? [selectCol, ...dynamicCols, actionCol]
    : [selectCol, ...dynamicCols];
});

watch(
  () => props.data,
  (newData) => {
    dataRow.value = newData; // ✅ update data ใน table
  },
  { deep: true }
);
const reactiveData = computed(() => dataRow.value);

const table = useVueTable({
  get data() {
    return reactiveData.value; // ✅ reactive binding
  },
  get columns() {
    return columns.value; // ✅ reactive binding
  },
  enableRowSelection: true,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue: any) =>
    valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue: any) =>
    valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue: any) =>
    valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue: any) =>
    valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue: any) =>
    valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get expanded() {
      return expanded.value;
    },
    get columnPinning() {
      return columnPinning.value;
    },
  },
});

function getStickyLeftValue(columnId: string): string | undefined {
  const order = props.stickyCol;
  if (!order) return undefined;
  const widthsMap = order.reduce((acc, col) => {
    acc[col.columnId] = col.width;
    return acc;
  }, {} as Record<string, number>);
  let left = 0;
  for (const col of order) {
    if (col.columnId === columnId) break;
    left += widthsMap[col.columnId] ?? 0;
  }
  return `${left}px`;
}

const isDragging = ref(false);
const dragStartIndex = ref<number | null>(null);
const lastSelectedIndex = ref<number | null>(null);

function handleMouseDown(e: MouseEvent) {
  if (e.shiftKey) {
    const row = (e.target as HTMLElement).closest("tr");
    if (!row) return;

    isDragging.value = true;
    dragStartIndex.value = Number(row.dataset.index);
    selectRow(dragStartIndex.value);
  }
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value || dragStartIndex.value === null) return;

  const row = (e.target as HTMLElement).closest("tr");
  if (!row) return;

  const currentIndex = Number(row.dataset.index);
  selectRange(dragStartIndex.value, currentIndex);
}

function handleMouseUp() {
  isDragging.value = false;
  dragStartIndex.value = null;
}

function selectRow(index: number) {
  const row = table.getRowModel().rows[index];
  if (row) {
    rowSelection.value = { ...rowSelection.value, [row.id]: true };
  }
}

function selectRange(start: number, end: number) {
  const [min, max] = [Math.min(start, end), Math.max(start, end)];
  const newSelection: RowSelectionState = { ...rowSelection.value };

  for (let i = min; i <= max; i++) {
    const row = table.getRowModel().rows[i];
    if (!row) continue;

    // ✅ toggle: ถ้า row เลือกแล้ว จะ deselect, ถ้ายังไม่ได้เลือก จะ select
    newSelection[row.id] = true;
  }
  rowSelection.value = newSelection;
}

function handleRowClick(e: MouseEvent, index: number) {
  const rows = table.getRowModel().rows;
  const row = rows[index];
  if (!row) return;

  if (e.shiftKey && lastSelectedIndex.value !== null) {
    // ✅ Shift + Click → เลือกช่วง
    const [min, max] = [
      Math.min(lastSelectedIndex.value, index),
      Math.max(lastSelectedIndex.value, index),
    ];
    const newSelection: RowSelectionState = {};

    for (let i = min; i <= max; i++) {
      const r = rows[i];
      if (r) newSelection[r.id] = true;
    }
    rowSelection.value = newSelection;
  } else if (e.ctrlKey || e.metaKey) {
    // ✅ Ctrl (หรือ Cmd) + Click → toggle
    const current = rowSelection.value[row.id] ?? false;
    rowSelection.value = {
      ...rowSelection.value,
      [row.id]: !current,
    };
    lastSelectedIndex.value = index; // update จุดเริ่ม
  } else {
    // ✅ คลิกปกติ → เลือกแถวเดียว
    rowSelection.value = { [row.id]: true };
    lastSelectedIndex.value = index;
  }
}

function handleCheckboxClick(index: number, value: boolean, e?: MouseEvent) {
  if (e) e.stopPropagation(); // ป้องกัน row click ซ้ำ

  const rows = table.getRowModel().rows;
  const row = rows[index];
  if (!row) return;

  if (e?.shiftKey && lastSelectedIndex.value !== null) {
    // Shift + click → select range
    const [min, max] = [
      Math.min(lastSelectedIndex.value, index),
      Math.max(lastSelectedIndex.value, index),
    ];
    const newSelection: RowSelectionState = { ...rowSelection.value };
    for (let i = min; i <= max; i++) {
      const r = rows[i];
      if (r) newSelection[r.id] = true;
    }
    rowSelection.value = newSelection;
  } else if (e?.ctrlKey || e?.metaKey) {
    // Ctrl + click → toggle
    rowSelection.value = {
      ...rowSelection.value,
      [row.id]: !rowSelection.value[row.id],
    };
    lastSelectedIndex.value = index;
  } else {
    // คลิกปกติ
    rowSelection.value = { [row.id]: true };
    lastSelectedIndex.value = index;
  }
}

onMounted(() => {
  window.addEventListener("mouseup", handleMouseUp);
});

onUnmounted(() => {
  window.removeEventListener("mouseup", handleMouseUp);
});
</script>

<style></style>
