<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronsUpDown,
  Mail,
  Plus,
} from "lucide-vue-next";
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
import { cn, valueUpdater } from "~/lib/utils";
import { useMediaQuery } from "@vueuse/core";
import CustomerTableDropdown from "./CustomerTableDropdown.vue";
import type { Customer, CustomerTableRow } from "~/composables/types/customer";
import { mapCustomersToTableRows } from "~/utils/format-customer-table-row";

const activeStatus = ref("all");
const searchQuery = ref("");
const addCustomer = ref(false);

const isMobile = useMediaQuery("(max-width: 660px)");
const isTablet = useMediaQuery("(max-width: 968px)");
const isPinningCol = useMediaQuery("(max-width: 767px)");

const screenSize = computed(() => {
  if (isMobile.value) return "mobile";
  // if (isTablet.value) return "tablet";
  return "desktop";
});

const customerStore = useCustomerStore();
const data = customerStore.customersList;

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

const columnHelper = createColumnHelper<CustomerTableRow>();

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
    enablePinning: true,
  }),

  // ✅ หมายเลขผู้เสียภาษี (TIN)
  columnHelper.accessor("tin", {
    header: "หมายเลขผู้เสียภาษี",
    cell: ({ row }) => h("div", {}, row.getValue("tin")),
    enablePinning: true,
  }),

  // ✅ ชื่อ
  columnHelper.accessor("name", {
    header: "ชื่อ",
    cell: ({ row }) =>
      h(
        "div",
        { class: isPinningCol.value ? "sticky left-0 z-10" : "" },
        row.getValue("name")
      ),
    enablePinning: true,
  }),

  // ✅ ประเภทลูกค้า
  columnHelper.accessor("type", {
    header: "ประเภทลูกค้า",
    cell: ({ row }) => h("div", {}, row.getValue("type")),
    enableSorting: true,
  }),

  // ✅ เบอร์โทรศัพท์
  columnHelper.accessor("phone", {
    header: "เบอร์โทรศัพท์",
    cell: ({ row }) => h("div", {}, row.getValue("phone")),
  }),

  // ✅ อีเมล
  columnHelper.accessor("email", {
    header: "อีเมล",
    cell: ({ row }) => h("div", {}, row.getValue("email")),
  }),

  // ✅ ปุ่มการจัดการ (Edit/Delete)
  columnHelper.display({
    id: "actions",
    header: () => h("div", { class: "text-center" }, "จัดการ"),
    cell: ({ row }) =>
      h("div", { class: "flex justify-center" }, [
        h(CustomerTableDropdown, { customer: row.original }),
      ]),
    enablePinning: false,
  }),
];

const tableRows = mapCustomersToTableRows(data);
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});
const columnPinning = ref<ColumnPinningState>({});

const table = useVueTable({
  data: tableRows,
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
    get columnPinning() {
      return columnPinning.value;
    },
  },
});

watch(
  isPinningCol,
  (pin) => {
    if (pin) {
      columnPinning.value = {
        left: ["select", "name"],
        right: ["actions"],
      };
    } else {
      columnPinning.value = {
        left: [],
        right: [],
      };
    }
  },
  { immediate: true }
);

function getStickyLeftValue(columnId: string): string | undefined {
  const widths = {
    select: 24,
    name: 200,
  };

  const order: (keyof typeof widths)[] = ["select", "name"];

  if (!order.includes(columnId as keyof typeof widths)) {
    return undefined;
  }

  let left = 0;
  for (const id of order) {
    if (id === columnId) break;
    left += widths[id] ?? 0;
  }

  return `${left}px`;
}
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between gap-4">
      <Input
        class="max-w-sm"
        placeholder="ค้นหาด้วย หมายเลขผู้เสียภาษี"
        :model-value="table.getColumn('tin')?.getFilterValue() as string"
        @update:model-value="table.getColumn('tin')?.setFilterValue($event)"
      />
      <div class="flex gap-2">
        <BaseButton @click="addCustomer = true"
          ><Plus class="w-4 h-4" /> เพิ่มข้อมูลลูกค้า</BaseButton
        >
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
      <Table class="relative">
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
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
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
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
            <BaseCard
              v-for="(customer, index) in tableRows"
              :key="customer.id"
              :value="`item-${customer.id}`"
              class="px-2 py-0 m-0 overflow-x-hidden"
            >
              <AccordionItem :value="`${customer.id}`" class="p-0 m-0">
                <AccordionTrigger>
                  <div class="flex items-center gap-4 w-full relative m-0">
                    <div
                      :class="[
                        'absolute h-[calc(100%+2rem)] w-1 left-[-0.55rem]',
                        customer.type === 'บุคคลธรรมดา'
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
                          {{ customer.name }}
                        </span>
                      </div>
                    </div>
                    <p
                      class="absolute left-10 bottom-[-.5rem] flex flex-nonw gap-2 items-center text-[.8rem] font-normal text-muted-foreground truncate text-muted-600 dark:text-muted-400 w-full"
                    >
                      <Mail :size="15" />
                      {{ customer.email }}
                      <span><strong>วันที่ออกใบ :</strong></span>
                    </p>

                    <div class="ml-auto" @click.stop>
                      <CustomerTableDropdown :customer="customer" />
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
                          customer.type === 'บุคคลธรรมดา'
                            ? 'bg-primary-500'
                            : 'bg-green-500',
                        ]"
                        >{{
                          customer.type === "บุคคลธรรมดา"
                            ? "บุคคลธรรมดา"
                            : "นิติบุคคล"
                        }}</Badge
                      >
                    </div>
                    <p>
                      หมายเลขผู้เสียภาษี :
                      <span class="text-muted-600 dark:text-muted-400">{{
                        customer.tin
                      }}</span>
                    </p>
                    <p>
                      ที่อยู่ :
                      <span class="text-muted-600 dark:text-muted-400"
                        >{{ customer.address || "-" }}
                      </span>
                    </p>
                    <p>
                      เบอร์ติดต่อ :
                      <span class="text-muted-600 dark:text-muted-400">{{
                        customer.phone ? customer.phone : "-"
                      }}</span>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </BaseCard>
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
    <FeatureCustomerDialogManagement mode="create" v-model="addCustomer" />
  </div>
</template>
