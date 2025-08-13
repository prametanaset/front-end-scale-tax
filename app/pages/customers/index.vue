<template>
  <div class="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-theme(spacing.20))]">
    <!-- <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> -->
    <div class="flex flex-col md:flex-row flex-1 gap-4">
      <!-- Left Pane -->
      <div class="flex-[3] flex flex-col gap-4">
        <template v-if="isLoading">
          <CustomerSkeleton />
        </template>
        <template v-else>
          <CustomerTable />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CustomerSkeleton from "~/components/feature/customer/CustomerSkeleton.vue";
import CustomerTable from "~/components/feature/customer/CustomerTable.vue";
import type { Customer } from "~/composables/types/customer";

definePageMeta({
  breadcrumb: [{ label: "รายชื่อลูกค้า" }],
});

const customerStore = useCustomerStore();
const isLoading = ref(true);
const note = ref("");

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
      tin: "2465796315786",
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

onMounted(() => {
  customerStore.setCustomerList(data);
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
});
</script>

<style></style>
