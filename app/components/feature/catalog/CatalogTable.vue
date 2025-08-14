<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
  ColumnMeta,
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
import { ArrowUpDown, ChevronDown, Plus, Search, X } from "lucide-vue-next";
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
import { useMediaQuery } from "@vueuse/core";
import type { Product } from "~/composables/types/product";
import { Badge } from "~/components/ui/badge";

const activeStatus = ref("all");
const searchQuery = ref("");
const activeDialogAddProduct = ref(false);
const catalogStore = useCatalogStore();

const isMobile = useMediaQuery("(max-width: 660px)");
const isTablet = useMediaQuery("(max-width: 968px)");
const screenSize = computed(() => {
  if (isMobile.value) return "mobile";
  // if (isTablet.value) return "tablet";
  return "desktop";
});

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();

  // กรองจาก tab ก่อน
  let list = data;
  if (activeStatus.value === "0") {
    list = list.filter((c) => c.vat_type === "include");
  } else if (activeStatus.value === "1") {
    list = list.filter((c) => c.vat_type === "exclude");
  } else if (activeStatus.value === "2") {
    list = list.filter((c) => c.vat_type === "exempt");
  }

  // ถ้ามีข้อความค้นหาให้กรองเพิ่ม
  if (!q) return list;

  return list.filter((product) => {
    return (
      product.name.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q)
    );
  });
});

const data: Product[] = catalogStore.productsList;

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
    meta: { label: "SKU" },
    cell: ({ row }) => h("div", { class: "capitalize" }, row.getValue("sku")),
  },
  {
    accessorKey: "name",
    header: "ชื่อสินค้า",
    meta: { label: "ชื่อสินค้า" },
    cell: ({ row }) => h("div", { class: "lowercase" }, row.getValue("name")),
  },
  {
    accessorKey: "vat_type",
    header: "ประเภทภาษี",
    meta: { label: "ประเภทภาษี" },
    cell: ({ row }) => {
      const label =
        row.getValue("vat_type") === "include"
          ? "รวมภาษี"
          : row.getValue("vat_type") === "exclude"
          ? "ยังไม่รวมภาษี"
          : "ไม่รวมภาษี";

      const color =
        row.getValue("vat_type") === "include"
          ? "bg-primary-500"
          : row.getValue("vat_type") === "exclude"
          ? "bg-green-500"
          : "bg-gray-500";

      return h(Badge, { class: color }, () => label);
    },
  },
  {
    accessorKey: "vat_rate",
    meta: { label: "ภาษี" },
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
    meta: { label: "ราคา" },
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
      const product = row.original;

      return h("div", { class: "flex justify-center" }, [
        h(CatalogTableDropdown, { product }),
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
  data: filteredProducts,
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
      <BaseSearchInput
        place-holder="ค้นหาด้วย SKU หรือ ชื่อสินค้า"
        v-model="searchQuery"
      />

      <div class="flex gap-2">
        <BaseButton @click="activeDialogAddProduct = true"
          ><Plus class="w-4 h-4" /> เพิ่มสินค้า</BaseButton
        >
        <FeatureCatalogManageDialog
          mode="create"
          v-model="activeDialogAddProduct"
        />
        <DropdownMenu v-if="screenSize === 'desktop'">
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
              {{ column.columnDef.meta?.label }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div class="mt-2">
      <Tabs v-if="screenSize === 'desktop'" v-model="activeStatus">
        <TabsList class="inline-flex space-x-2 p-0 bg-transparent">
          <TabsTrigger
            value="all"
            class="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-black dark:data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            ทั้งหมด
          </TabsTrigger>
          <TabsTrigger
            value="0"
            class="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-black dark:data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            รวมภาษี
          </TabsTrigger>
          <TabsTrigger
            value="1"
            class="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-black dark:data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            ยังไม่รวมภาษี
          </TabsTrigger>
          <TabsTrigger
            value="2"
            class="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-black dark:data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            ไม่รวมภาษี
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Select v-else v-model="activeStatus">
        <SelectTrigger>
          <SelectValue placeholder="ทั้งหมด" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all"> ทั้งหมด </SelectItem>
            <SelectItem value="0"> รวมภาษี </SelectItem>
            <SelectItem value="1"> ยังไม่รวมภาษี </SelectItem>
            <SelectItem value="2"> ไม่รวมภาษี </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div v-if="screenSize === 'desktop'" class="rounded-md border mt-4">
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
    <div class="mt-2" v-else>
      <Tabs v-model="activeStatus">
        <TabsContent
          v-for="tab in ['all', '0', '1', '2']"
          :value="tab"
          class="p-0 m-0"
        >
          <BaseCard
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            :value="`item-${product.id}`"
            class="px-2 py-4 m-0 overflow-x-hidden"
          >
            <div>
              <div class="flex items-center gap-4 w-full relative m-0">
                <div
                  :class="[
                    'absolute h-[calc(100%+2rem)] w-1 left-[-0.55rem]',
                    product.vat_type === 'include' ||
                    product.vat_type === 'exclude'
                      ? 'bg-primary-500'
                      : 'bg-green-500',
                  ]"
                ></div>
                <Checkbox :id="`checkbox-${product.id}`" class="ml-2" />

                <div class="flex items-start overflow-hidden min-w-0 mb-3">
                  <div
                    class="truncate overflow-x-hidden whitespace-nowrap min-w-0"
                  >
                    <span class="text-sm text-muted-foreground mr-5">
                      {{ product.name }}
                    </span>
                    <Badge
                      :class="[
                        product.vat_type === 'include' ||
                        product.vat_type === 'exclude'
                          ? 'bg-primary-500'
                          : 'bg-green-500',
                      ]"
                      >{{
                        product.vat_type === "exempt"
                          ? "ไม่รวมภาษี"
                          : product.vat_type === "include"
                          ? "รวมภาษี"
                          : "ยังไม่รวมภาษี"
                      }}</Badge
                    >
                  </div>
                </div>
                <p
                  class="absolute left-10 bottom-[-.5rem] flex flex-nonw gap-2 items-center text-[.8rem] font-normal text-muted-foreground truncate text-muted-600 dark:text-muted-400 w-full"
                >
                  <strong>SKU :</strong>
                  {{ product.sku }}
                  <span><strong>ราคา :</strong> {{ product.price }} บาท</span>
                </p>

                <div class="ml-auto">
                  <CatalogTableDropdown :product="product" />
                </div>
              </div>
            </div>
          </BaseCard>
        </TabsContent>
      </Tabs>
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
