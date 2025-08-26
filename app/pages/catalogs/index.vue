<template>
  <div class="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-theme(spacing.20))] ">
    <!-- <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> -->
    <div class="flex flex-col md:flex-row flex-1 gap-4">
      <!-- Left Pane -->
      <div class="flex-[3] flex flex-col gap-4">
        <template v-if="isLoading">
          <CatalogSkeleton />
        </template>
        <template v-else>
          <CatalogTable />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CatalogSkeleton from "~/components/feature/catalog/CatalogSkeleton.vue";
import CatalogTable from "~/components/feature/catalog/CatalogTable.vue";
import type { Product } from "~/composables/types/product";

definePageMeta({
  breadcrumb: [{ label: "แคตตาล็อกสินค้า" }],
});

const isLoading = ref(true);
const catalogStore = useCatalogStore();

const data: Product[] = [
  {
    id: 1,
    store_id: "7719413e-ed02-4411-a73b-0a7dc3341913",
    sku: "PROD-001",
    name: "iPhone 16",
    price: 20900,
    vat_type: "include",
    vat_rate: 7,
    created_at: "2025-07-02T10:05:25.801272Z",
    updated_at: "2025-07-02T10:05:25.801272Z",
    product_image: {
      id: 1,
      product_id: 1,
      url: "https://www.uficon.com/app/smush-webp/2023/09/TH_iPhone_15_Pink_PDP_Image_Position-1B_Pink_Color-640x640.jpg.webp",
    },
  },
  {
    id: 2,
    store_id: "7719413e-ed02-4411-a73b-0a7dc3341913",
    sku: "PROD-002",
    name: "ไข่ไก่",
    price: 100,
    vat_type: "exempt",
    vat_rate: 0,
    created_at: "2025-07-02T10:16:02.47667Z",
    updated_at: "2025-07-02T10:16:02.47667Z",
    product_image: {
      id: 2,
      product_id: 2,
      url: "https://cms.betagro-food.com/wp-content/uploads/2022/06/egg.jpg",
    },
  },
  {
    id: 6,
    store_id: "7719413e-ed02-4411-a73b-0a7dc3341913",
    sku: "PROD-003",
    name: "15-inch MacBook Air",
    price: 42800,
    vat_type: "exclude",
    vat_rate: 7,
    created_at: "0001-01-01T00:00:00Z",
    updated_at: "2025-07-03T07:46:00.610405Z",
    product_image: {
      id: 7,
      product_id: 6,
      url: "https://media.studio7thailand.com/180705/MacBook_Air_15-inch_M4_Non-AI_Mar25_Sky_Blue_PDP_Image_Position_1__TH-TH.png",
    },
  },
  {
    id: 7,
    store_id: "7719413e-ed02-4411-a73b-0a7dc3341913",
    sku: "PROD-004",
    name: "iphone",
    price: 2000,
    vat_type: "include",
    vat_rate: 7,
    created_at: "2025-07-10T18:50:30.371416Z",
    updated_at: "2025-07-10T18:50:30.371416Z",
    product_image: {
      id: 8,
      product_id: 7,
      url: "https://media.studio7thailand.com/154744/iPhone_16_Pro_Max_White_Titanium_PDP_Image_Position_1a_White_Titanium_Color__TH-TH-square_medium.png",
    },
  },
];

onMounted(() => {
  // catalogStore.setProductList(data);
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
});
</script>

<style></style>
