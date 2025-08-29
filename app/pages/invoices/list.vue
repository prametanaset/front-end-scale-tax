<template>
  <div
    class="flex flex-1 flex-col gap-4 h-[calc(100vh-theme(spacing.20))] mt-2"
  >
    <BaseDataTable :data="data" :column-name="colName"></BaseDataTable>
  </div>
</template>

<script lang="ts" setup>

const data = [
  {
    id: 1,
    invoiceNumber: "INV-2025-0001",
    date: "2025-08-01",
    customerName: "บริษัท เอ บี ซี จำกัด",
    customerTaxId: "0105551234567",
    amount: 15000.0,
    vat: 1050.0,
    totalAmount: 16050.0,
    status: "PAID",
  },
  {
    id: 2,
    invoiceNumber: "INV-2025-0002",
    date: "2025-08-02",
    customerName: "ห้างหุ้นส่วน ซี ดี อี",
    customerTaxId: "0105557654321",
    amount: 25000.0,
    vat: 1750.0,
    totalAmount: 26750.0,
    status: "UNPAID",
  },
  {
    id: 3,
    invoiceNumber: "INV-2025-0003",
    date: "2025-08-03",
    customerName: "นายสมชาย ใจดี",
    customerTaxId: "1234567890123",
    amount: 5000.0,
    vat: 350.0,
    totalAmount: 5350.0,
    status: "CANCELLED",
  },
  {
    id: 4,
    invoiceNumber: "INV-2025-0004",
    date: "2025-08-04",
    customerName: "บริษัท ไทยซอฟท์ จำกัด",
    customerTaxId: "0105556789012",
    amount: 100000.0,
    vat: 7000.0,
    totalAmount: 107000.0,
    status: "PAID",
  },
  {
    id: 5,
    invoiceNumber: "INV-2025-0005",
    date: "2025-08-05",
    customerName: "คุณวิภา สุขใจ",
    customerTaxId: "9876543210987",
    amount: 8000.0,
    vat: 560.0,
    totalAmount: 8560.0,
    status: "UNPAID",
  },
];

const colName = {
  id: "--hide--",
};
</script>

<style></style>
