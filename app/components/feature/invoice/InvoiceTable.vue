<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[100px]">Invoice</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Method</TableHead>
        <TableHead class="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="invoice in invoices" :key="invoice.invoice">
        <TableCell class="font-medium">{{ invoice.invoice }}</TableCell>
        <TableCell>{{ invoice.paymentStatus }}</TableCell>
        <TableCell>{{ invoice.paymentMethod }}</TableCell>
        <TableCell class="text-right">{{ invoice.totalAmount }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup lang="ts">
defineProps<{
  invoices: {
    invoice: string
    paymentStatus: string
    totalAmount: string
    paymentMethod: string
  }[]
}>()
</script>
