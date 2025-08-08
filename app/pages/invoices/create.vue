<template>
  <div class="flex flex-col h-[calc(100vh-theme(spacing.20))]">
    <div class="flex flex-col md:flex-row flex-1 gap-4 min-h-0">
      <!-- Left Pane -->
      <div
        :class="[
          'flex flex-col gap-4 p-4  transition-all duration-300 min-h-0 overflow-auto',
          isRightExpanded ? 'md:flex-[3]' : 'md:flex-[6]',
        ]"
        class="flex-1"
      >
        <!-- <template v-if="isLoading">
          <InvoiceSkeleton />
        </template> -->
        <!-- <template v-else> -->
          <InvoiceHeader />
          <InvoiceCardGroup />
          <div class="flex-1 min-h-0">
            <FeatureInvoiceProductLine />
          </div>
        <!-- </template> -->
      </div>

      <!-- Divider -->
      <Separator orientation="vertical" class="hidden md:block" />

      <!-- Right Pane -->
      <div
        :class="[
          'flex flex-col gap-4 p-4  transition-all duration-300 min-h-0 overflow-hidden',
          isRightExpanded ? 'md:flex-[3]' : 'md:flex-[2]',
        ]"
        class="flex-1"
      >
        <template v-if="isLoading">
          <Skeleton class="rounded-xl h-10 w-1/4" />
          <Skeleton class="rounded-xl flex-1" />
        </template>
        <template v-else>
          <Transition
            mode="out-in"
            enter-active-class="transition-all duration-400 ease-in-out"
            enter-from-class="opacity-0 translate-x-2"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-300 ease-in-out"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 translate-x-2"
          >
            <div
              v-if="!isRightExpanded"
              key="summary"
              class="flex flex-col flex-1 min-h-0 overflow-auto"
            >
              <InvoiceRightPanel />
            </div>

            <div
              v-else
              key="preview"
              class="flex flex-col flex-1 min-h-0 overflow-auto"
            >
              <InvoicePreview />
            </div>
          </Transition>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InvoiceSkeleton from "@/components/feature/invoice/InvoiceSkeleton.vue";
import InvoiceHeader from "@/components/feature/invoice/InvoiceHeader.vue";
import InvoiceTable from "@/components/feature/invoice/InvoiceTable.vue";
import InvoiceCardGroup from "@/components/feature/invoice/InvoiceCardGroup.vue";
import InvoicePreview from "@/components/feature/invoice/InvoicePreview.vue";
import InvoiceRightPanel from "@/components/feature/invoice/InvoiceRightPanel.vue";

const paneStore = useRightPaneStore();
const { isRightExpanded } = storeToRefs(paneStore);
const { toggleExpand } = paneStore;

definePageMeta({
  breadcrumb: [
    { label: "รายงานใบแจ้งหนี้", href: "/invoices" },
    { label: "สร้างใบแจ้งหนี้" },
  ],
  name: "invoices-create",
});

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
});

const invoices = ref([
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]);
</script>