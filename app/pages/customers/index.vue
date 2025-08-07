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

definePageMeta({
  breadcrumb: [{ label: "รายชื่อลูกค้า" }],
});

const isLoading = ref(true);
const note = ref("");

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
});
</script>

<style></style>
