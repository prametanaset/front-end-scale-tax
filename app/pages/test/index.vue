<template>
  <div class="">
    <BaseDataTable
      :data="accordionItems"
      :column-name="colName"
      :sticky-col="stickyCol"
    />
  </div>
</template>

<script setup lang="ts">
import { FileInput, Send } from "lucide-vue-next";
import { Motion } from "motion-v";
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

const colName = {
  value: "ค่า",
  title: "หัวข้อ",
  content: "วันที่",
  amount: "ราคา",
  status: "สถานะ",
  invoiceNo: "รหัส",
  email: "อีเมล",
  firstName: "ชื่อ",
  lastName: "นามสกุล",
  invoiceType: "ประเภท",
  customerType: "ประเภทลูกค้า",
};

const stickyCol = [
  { columnId: "title", width: 200 },
  { columnId: "amount", width: 100 },
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
