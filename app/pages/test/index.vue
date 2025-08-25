<template>
  <div class="w-full max-w-md mx-auto p-4">
    <Accordion type="single" class="w-full space-y-4" collapsible>
      <AccordionItem
        v-for="item in accordionItems"
        :key="item.value"
        :value="item.value"
        class="border-b-0"
      >
        <!-- คลิกแล้วเปิด Drawer แทน -->
        <AccordionTrigger
          @click.stop.prevent="openDrawer(item)"
          class="data-[state=open]:rounded-b-none shadow-md px-2 flex items-center justify-between hover:no-underline py-2 cursor-pointer"
        >
          <!-- ซ้าย: หัวข้อ + วันที่ -->
          <div class="flex flex-col text-left gap-1">
            <p class="font-medium">{{ item.title }}</p>
            <p class="text-sm text-gray-500">{{ item.content }}</p>
          </div>

          <!-- ขวา: จำนวนเงิน + Badge -->
          <template #icon>
            <div class="flex flex-col text-right items-end gap-1">
              <p>฿{{ formatBaht(item.amount) }}</p>
              <Badge
                variant="secondary"
                :class="badgeColor(item.status)"
                class="capitalize"
              >
                {{ item.status }}
              </Badge>
            </div>
          </template>
        </AccordionTrigger>

        <!-- ไม่ใช้แล้วก็ซ่อนไว้ หรือจะลบออกเลยก็ได้ -->
        <AccordionContent class="hidden" />
      </AccordionItem>
    </Accordion>
  </div>

  <!-- Drawer -->
  <Drawer v-model:open="drawerOpen">
    <DrawerContent>
      <DrawerHeader>
        <!-- <DrawerTitle class="flex justify-center">
          <img
            src="/img/invoice.png"
            class="w-40 relative -bottom-10"
            alt="logo-invoice"
          />
        </DrawerTitle> -->

        <DrawerDescription class="flex flex-col pt-14">
          <BaseCard class="bg-gray-100/20">
            <CardHeader class="flex flex-col items-center relative gap-1 pt-12 border-b">
               <img
                src="/img/invoice.png"
                class="w-40 absolute -top-20"
                alt="logo-invoice"
              />
              <CardTitle class="text-4xl font-bold mt-12"
                >{{ formatBaht(selectedItem?.amount ?? 0) }} บาท</CardTitle
              >
              <CardDescription
                >No. {{ selectedItem?.invoiceNo ?? "-" }}</CardDescription
              >
            </CardHeader>

            <CardContent class="flex items-start justify-between">
              <div class="flex flex-col text-left gap-3">
                <p class="font-medium">Status</p>
                <p class="text-sm text-gray-500">Payment Date</p>
              </div>

              <div class="flex flex-col text-right items-end gap-3">
                <Badge
                  :class="badgeColor(selectedItem?.status ?? 'ยังไม่ส่ง')"
                  class="capitalize"
                >
                  {{ selectedItem?.status ?? "ยังไม่ส่ง" }}
                </Badge>
                <span class="text-sm text-gray-500">{{
                  selectedItem?.content ?? "-"
                }}</span>
              </div>
            </CardContent>
          </BaseCard>
        </DrawerDescription>
      </DrawerHeader>

      <div class="px-6 pb-6 space-y-3">
        <div class="flex justify-between">
          <span>จำนวนเงิน</span>
          <span class="font-medium"
            >฿{{ selectedItem ? formatBaht(selectedItem.amount) : "" }}</span
          >
        </div>
        <!-- ใส่รายละเอียดอื่น ๆ ที่ต้องการแสดงใน Drawer ได้ที่นี่ -->
      </div>

      <DrawerFooter>
        <div class="flex items-center justify-center w-full gap-4">
          <BaseButton variant="outline"><Send /> Send Invoice</BaseButton>
          <BaseButton variant="outline"><FileInput /> Export</BaseButton>
        </div>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import { FileInput, Send } from "lucide-vue-next";
type Status = "ส่งแล้ว" | "ยังไม่ส่ง" | "ยกเลิก";

type InvoiceType = "ใบแจ้งหนี้" | "ใบเสร็จรับเงิน" | "ใบกำกับภาษี";
type CustomerType = "บุคคลธรรมดา" | "นิติบุคคล";

interface AccordionItem {
  value: string;
  title: string;
  content: string; // วันที่
  amount: number;
  status: Status;
  invoiceNo: string;
  email: string;
  firstName: string;
  lastName: string;
  invoiceType: InvoiceType;
  customerType: CustomerType;
}

const accordionItems: AccordionItem[] = [
  {
    value: "item-1",
    title: "วันเริ่มต้นโครงการ",
    content: "2025-08-01",
    amount: 100000,
    status: "ส่งแล้ว",
    invoiceNo: "INV-2025-0001",
    email: "customer1@example.com",
    firstName: "สมชาย",
    lastName: "ใจดี",
    invoiceType: "ใบแจ้งหนี้",
    customerType: "บุคคลธรรมดา",
  },
  {
    value: "item-2",
    title: "วันสิ้นสุดโครงการ",
    content: "2025-12-31",
    amount: 250000,
    status: "ยังไม่ส่ง",
    invoiceNo: "INV-2025-0002",
    email: "customer2@example.com",
    firstName: "วิภา",
    lastName: "สุขใจ",
    invoiceType: "ใบกำกับภาษี",
    customerType: "นิติบุคคล",
  },
  {
    value: "item-3",
    title: "วันประชุมรอบแรก",
    content: "2025-09-15",
    amount: 50000,
    status: "ยกเลิก",
    invoiceNo: "INV-2025-0003",
    email: "customer3@example.com",
    firstName: "กิตติ",
    lastName: "ตั้งตรง",
    invoiceType: "ใบแจ้งหนี้",
    customerType: "บุคคลธรรมดา",
  },
  {
    value: "item-4",
    title: "วันทดสอบระบบ",
    content: "2025-10-20",
    amount: 75000,
    status: "ยังไม่ส่ง",
    invoiceNo: "INV-2025-0004",
    email: "customer4@example.com",
    firstName: "พรทิพย์",
    lastName: "สวัสดี",
    invoiceType: "ใบเสร็จรับเงิน",
    customerType: "นิติบุคคล",
  },
  {
    value: "item-5",
    title: "วันเปิดตัว",
    content: "2026-01-05",
    amount: 500000,
    status: "ส่งแล้ว",
    invoiceNo: "INV-2026-0005",
    email: "customer5@example.com",
    firstName: "อนุชา",
    lastName: "รักดี",
    invoiceType: "ใบกำกับภาษี",
    customerType: "บุคคลธรรมดา",
  },
  {
    value: "item-6",
    title: "วันหมดอายุสัญญา",
    content: "2026-12-31",
    amount: 1200000,
    status: "ส่งแล้ว",
    invoiceNo: "INV-2026-0006",
    email: "customer6@example.com",
    firstName: "สุนีย์",
    lastName: "งามแท้",
    invoiceType: "ใบแจ้งหนี้",
    customerType: "นิติบุคคล",
  },
];

const drawerOpen = ref(false);
const selectedItem = ref<(typeof accordionItems)[number] | null>(null);

function openDrawer(item: (typeof accordionItems)[number]) {
  selectedItem.value = item;
  drawerOpen.value = true;
}

function formatBaht(n: number) {
  return n.toLocaleString("th-TH", { maximumFractionDigits: 2 });
}

// เลือกสี Badge ตามสถานะ (ปรับสีเองได้)
function badgeColor(status: Status) {
  switch (status) {
    case "ส่งแล้ว":
      return "bg-green-100 text-green-700";
    case "ยังไม่ส่ง":
      return "bg-yellow-100 text-yellow-700";
    case "ยกเลิก":
      return "bg-red-100 text-red-700 border";
  }
}
</script>
