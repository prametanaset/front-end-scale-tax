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
import { useMediaQuery } from "@vueuse/core";
import CustomerTableDropdown from "./CustomerTableDropdown.vue";
import type { Customer } from "~/composables/types/customer";

const activeStatus = ref("all");
const searchQuery = ref("");

const isMobile = useMediaQuery("(max-width: 660px)");
const isTablet = useMediaQuery("(max-width: 968px)");
const screenSize = computed(() => {
  if (isMobile.value) return "mobile";
  // if (isTablet.value) return "tablet";
  return "desktop";
});

const filteredCustomers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();

  // กรองจาก tab ก่อน
  let list = data;
  if (activeStatus.value === "0") {
    list = list.filter((c) => c.customer_type === "person");
  } else if (activeStatus.value === "1") {
    list = list.filter((c) => c.customer_type === "company");
  }

  // ถ้ามีข้อความค้นหาให้กรองเพิ่ม
  if (!q) return list;

  // return list.filter((customer) => {
  //   return (
  //     getCustomerDisplayTin(customer).toLowerCase().includes(q) ||
  //     getCustomerDisplayName(customer).toLowerCase().includes(q) ||
  //     getCustomerDisplayGmail(customer).toLowerCase().includes(q)
  //   );
  // });
});

const data: Customer[] = [
  {
    id: 19,
    store_id: "7719413e-ed02-4411-a73b-0a7dc3341913",
    customer_type: "person",
    status: "active",
    created_at: "2025-07-08T10:18:30.242381Z",
    created_by: 1,
    updated_at: "2025-07-08T10:18:30.242381Z",
    updated_by: 1,
    person_customer: {
      id: 8,
      customer_id: 19,
      first_name: "Tony",
      last_name: "Stark",
      tin: "1236785230923",
    },
    customer_address: {
      id: 19,
      customer_id: 19,
      address_line1: "test address",
      address_line2: "",
      province_id: 1,
      districts_id: 1033,
      subdistricts_id: 103302,
      postal_code: "10110",
    },
    customer_contacts: [
      {
        id: 68,
        customer_id: 19,
        contact_type: "email",
        contact_value: "email@gmail.com",
        created_at: "2025-07-08T10:18:30.305144Z",
      },
      {
        id: 69,
        customer_id: 19,
        contact_type: "phone",
        contact_value: "0987654321",
        created_at: "2025-07-08T10:18:30.325641Z",
      },
    ],
  },
  {
    id: 21,
    store_id: "7719413e-ed02-4411-a73b-0a7dc3341913",
    customer_type: "person",
    status: "active",
    created_at: "2025-07-08T12:23:18.503813Z",
    created_by: 1,
    updated_at: "2025-07-08T12:23:18.503813Z",
    updated_by: 1,
    person_customer: {
      id: 9,
      customer_id: 21,
      first_name: "สมปอง",
      last_name: "ครองใจ",
      tin: "1236785230923",
    },
    customer_address: {
      id: 21,
      customer_id: 21,
      address_line1: "999/9 ในเมือง",
      address_line2: "",
      province_id: 28,
      districts_id: 4001,
      subdistricts_id: 400101,
      postal_code: "40000",
    },
    customer_contacts: [
      {
        id: 72,
        customer_id: 21,
        contact_type: "email",
        contact_value: "email@gmail.com",
        created_at: "2025-07-08T12:23:18.566217Z",
      },
      {
        id: 73,
        customer_id: 21,
        contact_type: "phone",
        contact_value: "0123456780",
        created_at: "2025-07-08T12:23:18.587772Z",
      },
    ],
  },
  {
    id: 20,
    store_id: "7719413e-ed02-4411-a73b-0a7dc3341913",
    customer_type: "company",
    status: "active",
    created_at: "2025-07-08T10:27:55.882166Z",
    created_by: 1,
    updated_at: "2025-07-08T12:39:28.194464Z",
    updated_by: 1,
    company_customer: {
      id: 1,
      customer_id: 20,
      company_name: "Kon-Lhor Company",
      tin: "1236785230923",
      branch_no: "00001",
    },
    customer_address: {
      id: 20,
      customer_id: 20,
      address_line1: "company address",
      address_line2: "",
      province_id: 28,
      districts_id: 4001,
      subdistricts_id: 400101,
      postal_code: "40000",
    },
    customer_contacts: [
      {
        id: 74,
        customer_id: 20,
        contact_type: "email",
        contact_value: "test@example.com",
        created_at: "2025-07-08T12:39:28.275183Z",
      },
      {
        id: 75,
        customer_id: 20,
        contact_type: "phone",
        contact_value: "0987654321",
        created_at: "2025-07-08T12:39:28.275183Z",
      },
    ],
  },
];

const columns: ColumnDef<Customer>[] = [
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
        h(CustomerTableDropdown, { payment }),
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
              {{ column.id }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div v-if="screenSize !== 'desktop'" class="mt-2">
      <Tabs v-model="activeStatus">
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
            บุคคลธรรมดา
          </TabsTrigger>
          <TabsTrigger
            value="1"
            class="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-black dark:data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            นิติบุคคล
          </TabsTrigger>
        </TabsList>
      </Tabs>
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
          v-for="tab in ['all', '0', '1']"
          :value="tab"
          class="p-0 m-0"
        >
          <Accordion type="single" collapsible class="p-0 m-0">
            <AccordionItem
              v-for="(customer, index) in filteredCustomers"
              :key="customer.id"
              :value="`item-${customer.id}`"
              class="px-2 m-0 overflow-x-hidden"
            >
              <AccordionTrigger>
                <div class="flex items-center gap-4 w-full relative m-0">
                  <div
                    :class="[
                      'absolute h-[calc(100%+2rem)] w-1 left-[-0.55rem]',
                      customer.customer_type === 'person'
                        ? 'bg-primary-500'
                        : 'bg-green-500',
                    ]"
                  ></div>
                  <Checkbox :id="`checkbox-${customer.id}`" class="ml-2" />

                  <div class="flex items-start overflow-hidden min-w-0 mb-3">
                    <div
                      class="truncate overflow-x-hidden whitespace-nowrap min-w-0"
                    >
                      <span class="text-sm text-muted-foreground mr-5">
                        <!-- {{ getCustomerDisplayName(customer) }} -->
                        Customer name
                      </span>
                    </div>
                  </div>
                  <p
                    class="absolute left-10 bottom-[-.5rem] flex flex-nonw gap-2 items-center text-[.8rem] font-normal text-muted-foreground truncate text-muted-600 dark:text-muted-400 w-full"
                  >
                    <Mail :size="15" />
                    <!-- {{ getCustomerDisplayGmail(customer) }} -->
                    customer email
                    <span><strong>วันที่ออกใบ :</strong></span>
                  </p>

                  <div class="ml-auto">
                    <CustomerTableDropdown />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div
                  class="flex flex-col gap-2 text-sm text-muted-foreground ml-10"
                >
                  <div class="">
                    <Badge
                      :class="[
                        customer.customer_type === 'person'
                          ? 'bg-primary-500'
                          : 'bg-green-500',
                      ]"
                      >{{
                        customer.customer_type === "person"
                          ? "บุคคลธรรมดา"
                          : "นิติบุคคล"
                      }}</Badge
                    >
                  </div>
                  <p>
                    หมายเลขผู้เสียภาษี :
                    <!-- <span class="text-muted-600 dark:text-muted-400">{{
                      getCustomerDisplayTin(customer)
                    }}</span> -->
                  </p>
                  <p>
                    ที่อยู่ :
                    <!-- <span class="text-muted-600 dark:text-muted-400"
                      >{{ customer.customer_address?.address_line1 || "-" }}
                      {{ locationLabels[customer.id] || "..." }}</span
                    > -->
                  </p>
                  <p>
                    เบอร์ติดต่อ :
                    <!-- <span class="text-muted-600 dark:text-muted-400">{{
                      customer.customer_contacts[1].contact_value || "-"
                    }}</span> -->
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
