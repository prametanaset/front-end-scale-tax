<template>
  <div class="flex flex-col h-[calc(100vh-theme(spacing.20))]">
    <div class="flex flex-col md:flex-row flex-1 gap-4">
      <!-- Left Pane -->
      <div class="flex-[3] flex flex-col p-4 gap-4">
        <template v-if="isLoading">
          <InvoiceSkeleton />
        </template>
        <template v-else>
          <InvoiceHeader />
          <InvoiceCardGroup />
          <InvoiceTable :invoices="invoices" />
          <InvoiceNote v-model:note="note" />
        </template>
      </div>

      <!-- Divider -->
      <Separator orientation="vertical" class="hidden md:block" />

      <!-- Right Pane -->
      <div class="flex-[2] flex flex-col gap-4 p-4">
        <template v-if="isLoading">
          <Skeleton class="rounded-xl h-10 w-1/4" />
          <Skeleton class="rounded-xl flex-1" />
        </template>
        <template v-else>
          <InvoiceRightPanel />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InvoiceSkeleton from '@/components/feature/invoice/InvoiceSkeleton.vue'
import InvoiceHeader from '@/components/feature/invoice/InvoiceHeader.vue'
import InvoiceTable from '@/components/feature/invoice/InvoiceTable.vue'
import InvoiceCardGroup from '@/components/feature/invoice/InvoiceCardGroup.vue'
import InvoiceNote from '@/components/feature/invoice/InvoiceNote.vue'
import InvoiceRightPanel from '@/components/feature/invoice/InvoiceRightPanel.vue'

definePageMeta({
  breadcrumb: [
    { label: 'รายงานใบแจ้งหนี้', href: '/test' },
    { label: 'สร้างใบแจ้งหนี้' },
  ],
})

const isLoading = ref(true)
const note = ref('')

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})

const invoices = ref([
  { invoice: 'INV001', paymentStatus: 'Paid', totalAmount: '$250.00', paymentMethod: 'Credit Card' },
  { invoice: 'INV002', paymentStatus: 'Pending', totalAmount: '$150.00', paymentMethod: 'PayPal' },
  { invoice: 'INV003', paymentStatus: 'Unpaid', totalAmount: '$350.00', paymentMethod: 'Bank Transfer' },
  { invoice: 'INV004', paymentStatus: 'Paid', totalAmount: '$450.00', paymentMethod: 'Credit Card' },
  { invoice: 'INV005', paymentStatus: 'Paid', totalAmount: '$550.00', paymentMethod: 'PayPal' },
  { invoice: 'INV006', paymentStatus: 'Pending', totalAmount: '$200.00', paymentMethod: 'Bank Transfer' },
  { invoice: 'INV007', paymentStatus: 'Unpaid', totalAmount: '$300.00', paymentMethod: 'Credit Card' },
])
</script>
