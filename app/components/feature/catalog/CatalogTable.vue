<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { ArrowUpDown, ChevronDown, Plus } from "lucide-vue-next";
import { h, ref } from "vue";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { valueUpdater } from "~/lib/utils";
import CatalogTableDropdown from "./CatalogTableDropdown.vue";
import type { Product } from "~/composables/types/product";

const data: Product[] = [
  {
    id: 1,
    store_id: "7719413e-ed02-4411-a73b-0a7dc3341913",
    sku: "PROD-001",
    name: "iPhone 16",
    price: 20900,
    vat_type: "include",
    vat_rate: 7,
    created_at: "2025-07-02T10:05:25.801272Z",
    updated_at: "2025-07-02T10:05:25.801272Z",
    product_image: {
      id: 1,
      product_id: 1,
      url: "https://www.uficon.com/app/smush-webp/2023/09/TH_iPhone_15_Pink_PDP_Image_Position-1B_Pink_Color-640x640.jpg.webp",
    },
  },
  {
    id: 2,
    store_id: "7719413e-ed02-4411-a73b-0a7dc3341913",
    sku: "PROD-002",
    name: "ไข่ไก่",
    price: 100,
    vat_type: "exempt",
    vat_rate: 0,
    created_at: "2025-07-02T10:16:02.47667Z",
    updated_at: "2025-07-02T10:16:02.47667Z",
    product_image: {
      id: 2,
      product_id: 2,
      url: "https://cms.betagro-food.com/wp-content/uploads/2022/06/egg.jpg",
    },
  },
  {
    id: 6,
    store_id: "7719413e-ed02-4411-a73b-0a7dc3341913",
    sku: "PROD-003",
    name: "15-inch MacBook Air",
    price: 42800,
    vat_type: "exclude",
    vat_rate: 7,
    created_at: "0001-01-01T00:00:00Z",
    updated_at: "2025-07-03T07:46:00.610405Z",
    product_image: {
      id: 7,
      product_id: 6,
      url: "https://media.studio7thailand.com/180705/MacBook_Air_15-inch_M4_Non-AI_Mar25_Sky_Blue_PDP_Image_Position_1__TH-TH.png",
    },
  },
  {
    id: 7,
    store_id: "7719413e-ed02-4411-a73b-0a7dc3341913",
    sku: "PROD-004",
    name: "iphone",
    price: 2000,
    vat_type: "include",
    vat_rate: 7,
    created_at: "2025-07-10T18:50:30.371416Z",
    updated_at: "2025-07-10T18:50:30.371416Z",
    product_image: {
      id: 8,
      product_id: 7,
      url: "https://media.studio7thailand.com/154744/iPhone_16_Pro_Max_White_Titanium_PDP_Image_Position_1a_White_Titanium_Color__TH-TH-square_medium.png",
    },
  },
];

const columns: ColumnDef<Product>[] = [
  {
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
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => h("div", { class: "capitalize" }, row.getValue("sku")),
  },
  {
    accessorKey: "name",
    header: "ชื่อสินค้า",
    cell: ({ row }) => h("div", { class: "lowercase" }, row.getValue("name")),
  },
  {
    accessorKey: "vat_type",
    header: "ประเภทภาษี",
    cell: ({ row }) =>
      h(
        "div",
        { class: "lowercase" },
        row.getValue("vat_type") === "include"
          ? "รวมภาษี"
          : row.getValue("vat_type") === "exclude"
          ? "ยังไม่รวมภาษี"
          : "ยกเว้นภาษี"
      ),
  },
  {
    accessorKey: "vat_rate",
    header: ({ column }) => {
      return h(
        "div",
        { class: "text-right" }, // ใส่ class text-right ที่ div
        [
          h(
            Button,
            {
              variant: "ghost",
              onClick: () =>
                column.toggleSorting(column.getIsSorted() === "asc"),
            },
            () => ["ภาษี %", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
          ),
        ]
      );
    },
    cell: ({ row }) =>
      h(
        "div",
        { class: "lowercase, text-right" },
        row.getValue("vat_rate") + " %"
      ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return h(
        "div",
        { class: "text-right" }, // ใส่ class text-right ที่ div
        [
          h(
            Button,
            {
              variant: "ghost",
              onClick: () =>
                column.toggleSorting(column.getIsSorted() === "asc"),
            },
            () => ["ราคา", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
          ),
        ]
      );
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "THB",
      }).format(amount);

      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return h("div", { class: "flex justify-center" }, [
        h(CatalogTableDropdown, { payment }),
      ]);
    },
  },
];

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const table = useVueTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
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
  },
});
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between gap-4">
      <Input
        class="max-w-sm"
        placeholder="ค้นหาด้วย SKU"
        :model-value="table.getColumn('sku')?.getFilterValue() as string"
        @update:model-value="table.getColumn('sku')?.setFilterValue($event)"
      />
      <div class="flex gap-2">
        <BaseButton><Plus class="w-4 h-4" /> เพิ่มสินค้า</BaseButton>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" class="ml-auto">
              Columns <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              v-for="column in table
                .getAllColumns()
                .filter((column) => column.getCanHide())"
              :key="column.id"
              class="capitalize"
              :model-value="column.getIsVisible()"
              @update:model-value="
                (value) => {
                  column.toggleVisibility(!!value);
                }
              "
            >
              {{ column.id }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div class="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
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
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
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
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        เลือก {{ table.getFilteredSelectedRowModel().rows.length }} จาก
        {{ table.getFilteredRowModel().rows.length }}
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          ก่อนหน้า
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          ถัดไป
        </Button>
      </div>
    </div>
  </div>
</template>
