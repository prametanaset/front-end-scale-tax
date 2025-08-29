<script setup lang="ts">
import { Mail } from "lucide-vue-next";

import { useMediaQuery } from "@vueuse/core";
import CustomerTableDropdown from "./CustomerTableDropdown.vue";
import { mapCustomersToTableRows } from "~/utils/format-customer-table-row";

const activeStatus = ref("all");
const toolsStore = useToolsStore();

const isMobile = useMediaQuery("(max-width: 660px)");

const screenSize = computed(() => {
  if (isMobile.value) return "mobile";
  // if (isTablet.value) return "tablet";
  return "desktop";
});

const customerStore = useCustomerStore();
const data = customerStore.customersList;
const tableRows = mapCustomersToTableRows(data);
const colName = {
  id: "--hide--",
  name: "ชื่อ",
  first_name: "--hide--",
  last_name: "--hide--",
  type: "ประเภทลูกค้า",
  email: "อีเมล",
  tin: "หมายเลขผู้เสียภาษี",
  phone: "--hide--",
  address: "--hide--",
  branch_no: "--hide--",
  status: "--hide--",
  created_at: "--hide--",
  location_data: "--hide--",
  actions: "จัดการ",
};

const stickyCol = [
  { columnId: "select", side: "left" },
  { columnId: "actions", side: "right" },
];

const filteredCustomers = computed(() => {
  const q = toolsStore.query.trim().toLowerCase();
  // กรองจาก tab ก่อน
  let list = tableRows;
  if (activeStatus.value === "0") {
    list = list.filter((c) => c.type === "บุคคลธรรมดา");
  } else if (activeStatus.value === "1") {
    list = list.filter((c) => c.type === "นิติบุคคล");
  }

  // ถ้ามีข้อความค้นหาให้กรองเพิ่ม
  if (!q) return list;

  return list.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(q) ||
      customer.tin.toLowerCase().includes(q)
    );
  });
});
</script>

<template>
  <div class="w-full">
    <div class="">
      <div class="flex justify-between" v-if="screenSize == 'desktop'"></div>
      <Select v-else v-model="activeStatus">
        <SelectTrigger>
          <SelectValue placeholder="ทั้งหมด" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all"> ทั้งหมด </SelectItem>
            <SelectItem value="0"> บุคคลธรรมดา </SelectItem>
            <SelectItem value="1"> นิติบุคคล </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div v-if="screenSize === 'desktop'">
      <BaseDataTable
        :data="filteredCustomers"
        :column-name="colName"
        :action="CustomerTableDropdown"
        :sticky-col="stickyCol"
        div-classname="min-h-0 max-h-[calc(100vh-theme(spacing.40)-4.5rem)]"
      >
        <template #tabs>
          <Select v-model="activeStatus">
            <SelectTrigger>
              <SelectValue placeholder="ทั้งหมด" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all"> ทั้งหมด </SelectItem>
                <SelectItem value="0"> บุคคลธรรมดา </SelectItem>
                <SelectItem value="1"> นิติบุคคล </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </template>
      </BaseDataTable>
    </div>
    <div
      class="mt-2 max-h-[calc(100vh-theme(spacing.40)-1rem)] overflow-y-auto"
      v-else
    >
      <Tabs v-model="activeStatus">
        <TabsContent
          v-for="tab in ['all', '0', '1']"
          :value="tab"
          class="p-0 m-0"
        >
          <Accordion type="single" collapsible class="p-0 m-0">
            <BaseCard
              v-for="(customer, index) in filteredCustomers"
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
                      <CustomerTableDropdown :data="customer" />
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
    <div
      v-if="screenSize === 'desktop'"
      class="flex items-center justify-end gap-2 py-4"
    >
      <div class="flex-1 text-sm text-muted-foreground">
        ทั้งหมด 55 รายการ • หน้า 1 • ต่อหน้า 3
      </div>

      <!-- ตัวอย่างตัวเลือก perPage (ถ้ายังไม่มีที่อื่น) -->
      <Select>
        <SelectTrigger>20</SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem :value="5">5</SelectItem>
            <SelectItem :value="10">10</SelectItem>
            <SelectItem :value="20">20</SelectItem>
            <SelectItem :value="50">50</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div class="space-x-2">
        <BaseButton variant="outline" size="sm"> ก่อนหน้า </BaseButton>
        <BaseButton variant="outline" size="sm"> ถัดไป </BaseButton>
      </div>
    </div>
  </div>
</template>
