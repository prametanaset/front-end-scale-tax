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
  // ⚠ เอา client pagination ออก ใช้ server-side
  getFilteredRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { ArrowUpDown, ChevronDown, Plus } from "lucide-vue-next";
import { h, ref, computed, watch } from "vue";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useMediaQuery, useDebounceFn } from "@vueuse/core";
import type { Product } from "~/composables/types/product";
import { Badge } from "~/components/ui/badge";

// ---- เพิ่ม: ซิงก์กับ URL + ดึง API ----
const route = useRoute();
const router = useRouter();

function updateQuery(patch: Record<string, any>) {
  const q: Record<string, any> = { ...route.query, ...patch };
  Object.keys(q).forEach((k) => (q[k] === "" || q[k] == null) && delete q[k]);
  return router.replace({ query: q });
}

const page = computed<number>({
  get: () => Number.parseInt((route.query.page as string) ?? "1", 10),
  set: (v) => updateQuery({ page: String(v) }),
});

const perPage = computed<number>({
  get: () => Number.parseInt((route.query.perPage as string) ?? "10", 10),
  set: (v) => updateQuery({ perPage: String(v), page: "1" }),
});

const _filter = computed<string>({
  get: () => (route.query.filter as string) ?? "",
  set: (v) => updateQuery({ filter: v || undefined, page: "1" }),
});

// ค่าที่ใช้กับ UI
const searchQuery = ref(_filter.value);
const applyFilter = useDebounceFn((v: string) => (_filter.value = v), 300);
watch(searchQuery, (v) => applyFilter(v));

// พารามิเตอร์ที่ส่งไป API
const apiQuery = computed(() => ({
  page: page.value,
  perPage: perPage.value,
  filter: _filter.value,
}));

interface CatalogResponse {
  total: number;
  data: Product[];
}

const {
  data: apiRes,
  pending,
  error,
  refresh,
} = await useFetch<CatalogResponse>("/api/products", {
  query: apiQuery,
});

// list จาก server (ต่อให้กรองชื่อ/sku ที่ server แล้ว แต่ยังกรองตาม tab ฝั่ง client ต่อได้)
const serverList = computed<Product[]>(() => apiRes.value?.data ?? []);
const total = computed(() => apiRes.value?.total ?? 0);

// ---- ตัวแปร UI เดิม ๆ ----
const activeStatus = ref("all");
const activeDialogAddProduct = ref(false);
// ถ้าต้องการใช้ store ต่อก็ยังได้ แต่ตอนนี้เราใช้ server เป็นหลัก
// const catalogStore = useCatalogStore();

const isMobile = useMediaQuery("(max-width: 660px)");
const isTablet = useMediaQuery("(max-width: 968px)");
const screenSize = computed(() => {
  if (isMobile.value) return "mobile";
  return "desktop";
});

// กรองตาม tab + (ถ้าจะซ้ำกับ filter ชื่อ/sku ให้กรองเฉพาะ vat_type ฝั่ง client)
const filteredProducts = computed(() => {
  let list = serverList.value;

  if (activeStatus.value === "0") {
    list = list.filter((c: any) => c.vat_type === "include");
  } else if (activeStatus.value === "1") {
    list = list.filter((c: any) => c.vat_type === "exclude");
  } else if (activeStatus.value === "2") {
    list = list.filter((c: any) => c.vat_type === "exempt");
  }

  // ถ้าอยากให้ค้นหาจาก ui ฝั่ง client เพิ่มเติม (นอกเหนือจากที่ server กรองแล้ว) ก็ปลดคอมเมนต์ด้านล่าง
  // const q = searchQuery.value.trim().toLowerCase()
  // if (q) {
  //   list = list.filter((p: any) =>
  //     (p.name ?? "").toLowerCase().includes(q) || (p.sku ?? "").toLowerCase().includes(q)
  //   )
  // }

  return list;
});

// TanStack table: ใช้ข้อมูลที่ “แบ่งหน้าแล้ว” จาก server
const data = filteredProducts; // <- reactive ref/comp

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
    meta: { label: "SKU" as const },
    cell: ({ row }) =>
      h("div", { class: "capitalize" }, row.getValue("sku") ?? "-"),
  },
  {
    accessorKey: "name",
    header: "ชื่อสินค้า",
    meta: { label: "ชื่อสินค้า" as const },
    cell: ({ row }) =>
      h("div", { class: "lowercase" }, row.getValue("name") ?? "-"),
  },
  {
    accessorKey: "vat_type",
    header: "ประเภทภาษี",
    meta: { label: "ประเภทภาษี" as const },
    cell: ({ row }) => {
      const vt = row.getValue("vat_type");
      const label =
        vt === "include"
          ? "รวมภาษี"
          : vt === "exclude"
          ? "ยังไม่รวมภาษี"
          : "ไม่รวมภาษี";
      const color =
        vt === "include"
          ? "bg-red-500"
          : vt === "exclude"
          ? "bg-green-500"
          : "bg-gray-500";
      return h(Badge, { class: color }, () => label);
    },
  },
  {
    accessorKey: "vat_rate",
    meta: { label: "ภาษี" as const },
    header: ({ column }) =>
      h("div", { class: "text-right" }, [
        h(
          Button,
          {
            variant: "ghost",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          () => ["ภาษี %", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
        ),
      ]),
    cell: ({ row }) =>
      h("div", { class: "text-right" }, `${row.getValue("vat_rate") ?? "-"} %`),
  },
  {
    accessorKey: "price",
    meta: { label: "ราคา" as const },
    header: ({ column }) =>
      h("div", { class: "text-right" }, [
        h(
          Button,
          {
            variant: "ghost",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          () => ["ราคา", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
        ),
      ]),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("price") ?? 0);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "THB",
      }).format(amount || 0);
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
  data, // ข้อมูลจาก server ที่ถูก “แบ่งหน้าแล้ว”
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  // ❌ ตัด getPaginationRowModel ทิ้ง เพราะเราใช้ server-side
  onSortingChange: (u) => valueUpdater(u, sorting),
  onColumnFiltersChange: (u) => valueUpdater(u, columnFilters),
  onColumnVisibilityChange: (u) => valueUpdater(u, columnVisibility),
  onRowSelectionChange: (u) => valueUpdater(u, rowSelection),
  onExpandedChange: (u) => valueUpdater(u, expanded),
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
      <!-- ค้นหา: ผูกกับ URL (filter) แบบ debounce -->
      <BaseSearchInput
        place-holder="ค้นหาด้วย SKU หรือ ชื่อสินค้า"
        v-model="searchQuery"
      />

      <div class="flex gap-2">
        <BaseButton @click="activeDialogAddProduct = true">
          <Plus class="w-4 h-4" /> เพิ่มสินค้า
        </BaseButton>
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
                .filter((c) => c.getCanHide())"
              :key="column.id"
              class="capitalize"
              :model-value="column.getIsVisible()"
              @update:model-value="(value) => column.toggleVisibility(!!value)"
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
        <SelectTrigger><SelectValue placeholder="ทั้งหมด" /></SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="0">รวมภาษี</SelectItem>
            <SelectItem value="1">ยังไม่รวมภาษี</SelectItem>
            <SelectItem value="2">ไม่รวมภาษี</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <!-- ตาราง (desktop) -->
    <ScrollArea
      v-if="screenSize === 'desktop'"
      class="rounded-md border min-h-0 max-h-[calc(100vh-theme(spacing.64)-16px)] overflow-y-auto mt-4"
    >
      <Table div-classname="overflow-clip">
        <TableHeader class="sticky top-0 z-10 bg-background">
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
              {{ pending ? "กำลังโหลด..." : "No results." }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </ScrollArea>

    <!-- การ์ด (mobile) -->
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
                />
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
                    >
                      {{
                        product.vat_type === "exempt"
                          ? "ไม่รวมภาษี"
                          : product.vat_type === "include"
                          ? "รวมภาษี"
                          : "ยังไม่รวมภาษี"
                      }}
                    </Badge>
                  </div>
                </div>
                <p
                  class="absolute left-10 bottom-[-.5rem] flex flex-nonw gap-2 items-center text-[.8rem] font-normal text-muted-foreground truncate text-muted-600 dark:text-muted-400 w-full"
                >
                  <strong>SKU :</strong> {{ product.sku }}
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

    <!-- แถบสรุป + เปลี่ยนหน้า (server-side) -->
    <div class="flex items-center justify-end gap-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        ทั้งหมด {{ total }} รายการ • หน้า {{ page }} • ต่อหน้า {{ perPage }}
      </div>

      <!-- ตัวอย่างตัวเลือก perPage (ถ้ายังไม่มีที่อื่น) -->
      <select
        class="border rounded px-2 py-1 text-sm"
        :value="perPage"
        @change="perPage = parseInt(($event.target as HTMLSelectElement).value)"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>

      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="page <= 1 || pending"
          @click="page = Math.max(1, page - 1)"
        >
          ก่อนหน้า
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="page * perPage >= total || pending"
          @click="page = page + 1"
        >
          ถัดไป
        </Button>
      </div>
    </div>

    <div v-if="error" class="text-red-600 text-sm">
      เกิดข้อผิดพลาดในการโหลดข้อมูล
    </div>
  </div>
</template>
