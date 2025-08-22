<template>
  <ScrollArea class="max-h-[calc(100vh-theme(spacing.40))]">
    <Table div-classname="min-h-0 max-h-[calc(100vh-theme(spacing.20)-1rem)]">
      <!-- ✅ header sticky -->
      <TableHeader class="sticky top-0 z-10 bg-background">
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="px-4"
            :class="
              cn(
                { 'sticky bg-background/95': header.column.getIsPinned() },
                header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0'
              )
            "
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <template v-for="row in table.getRowModel().rows" :key="row.id">
            <TableRow :data-state="row.getIsSelected() && 'selected'">
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="px-4 py-2 cursor-pointer"
                :class="
                  cn(
                    { 'sticky bg-background/95': cell.column.getIsPinned() },
                    cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0'
                  )
                "
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
            <TableRow v-if="row.getIsExpanded()">
              <TableCell :colspan="row.getAllCells().length">
                {{ JSON.stringify(row.original) }}
              </TableCell>
            </TableRow>
          </template>
        </template>

        <TableRow v-else>
          <TableCell :colspan="columns.length" class="h-24 text-center">
            ไม่มีข้อมูล
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </ScrollArea>
</template>

<script lang="ts" setup>
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ExpandedState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/vue-table";
import {
  CircleEllipsis,
  Download,
  Eclipse,
  EllipsisVertical,
} from "lucide-vue-next";
import { ScrollAreaViewport } from "reka-ui";
import { Checkbox } from "~/components/ui/checkbox";
import { valueUpdater, cn } from "~/lib/utils";

type FileItem = {
  id: number;
  fileName: string;
  type: string;
  size: string;
  selected: boolean;
};
const columnHelper = createColumnHelper<any>();

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

const columns = [
  // ✅ Checkbox Select
  columnHelper.display({
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        modelValue:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:modelValue": (value) =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("fileName", {
    header: "ชื่อไฟล์",
    cell: ({ row }) => h("div", {}, row.getValue("fileName")),
  }),
  columnHelper.accessor("type", {
    header: "ประเภทไฟล์",
    cell: ({ row }) => h("div", {}, row.getValue("type")),
  }),
  columnHelper.accessor("size", {
    header: ({ column }) => {
      return h("div", { class: "hidden sm:block" }, "ขนาดไฟล์");
    },
    cell: ({ row }) =>
      h("div", { class: "hidden sm:block" }, row.getValue("size")),
  }),
  columnHelper.display({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) =>
      h("div", { class: "flex justify-center" }, [
        h(EllipsisVertical, { class: "cursor-pointer w-4 h-4" }),
      ]),
  }),
];

const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const table = useVueTable({
  data: computed(() => files.value),
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  state: {
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
    columnPinning: {
      right: ["actions"],
    },
  },
});
</script>

<style></style>
