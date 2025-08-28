<script setup lang="ts">
import { h, ref, computed, watch } from "vue";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CatalogTableDropdown from "./CatalogTableDropdown.vue";
import { useMediaQuery, useDebounceFn } from "@vueuse/core";
import type { Product } from "~/composables/types/product";
import { Badge } from "~/components/ui/badge";

// ---- เพิ่ม: ซิงก์กับ URL + ดึง API ----
const route = useRoute();
const router = useRouter();
const toolsStore = useToolsStore();

function updateQuery(patch: Record<string, any>) {
  const q: Record<string, any> = { ...route.query, ...patch };
  Object.keys(q).forEach((k) => (q[k] === "" || q[k] == null) && delete q[k]);
  return router.replace({ query: q });
}

const page = computed<number>({
  get: () => Number.parseInt((route.query.page as string) ?? "1", 10),
  set: (v) => updateQuery({ page: String(v) }),
});

const perPage = computed<number>({
  get: () => Number.parseInt((route.query.perPage as string) ?? "10", 10),
  set: (v) => updateQuery({ perPage: String(v), page: "1" }),
});

const _filter = computed<string>({
  get: () => (toolsStore.query as string) ?? "",
  set: (v) => updateQuery({ filter: v || undefined, page: "1" }),
});

// ค่าที่ใช้กับ UI
const searchQuery = ref(_filter.value);
const applyFilter = useDebounceFn((v: string) => (_filter.value = v), 300);
watch(searchQuery, (v) => applyFilter(v));

// พารามิเตอร์ที่ส่งไป API
const apiQuery = computed(() => ({
  page: page.value,
  perPage: perPage.value,
  filter: _filter.value,
}));

interface CatalogResponse {
  total: number;
  data: Product[];
}

const colName = {
  id: "--hide--",
  store_id: "--hide--",
  created_at: "--hide--",
  updated_at: "--hide--",
  product_image: "--hide--",
  name: "ชื่อสินค้า",
  price: "ราคา",
  vat_type: "ประเภทภาษี",
  vat_rate: "อัตราภาษี",
};

const {
  data: apiRes,
  pending,
  error,
  refresh,
} = await useFetch<CatalogResponse>("/api/products", {
  query: apiQuery,
});

// list จาก server (ต่อให้กรองชื่อ/sku ที่ server แล้ว แต่ยังกรองตาม tab ฝั่ง client ต่อได้)
const serverList = computed<Product[]>(() => apiRes.value?.data ?? []);

const total = computed(() => apiRes.value?.total ?? 0);

// ---- ตัวแปร UI เดิม ๆ ----
const activeStatus = ref("all");
const activeDialogAddProduct = ref(false);
// ถ้าต้องการใช้ store ต่อก็ยังได้ แต่ตอนนี้เราใช้ server เป็นหลัก
// const catalogStore = useCatalogStore();

const isMobile = useMediaQuery("(max-width: 660px)");
const isTablet = useMediaQuery("(max-width: 968px)");
const screenSize = computed(() => {
  if (isMobile.value) return "mobile";
  return "desktop";
});

// กรองตาม tab + (ถ้าจะซ้ำกับ filter ชื่อ/sku ให้กรองเฉพาะ vat_type ฝั่ง client)
const filteredProducts = computed(() => {
  let list = serverList.value;

  if (activeStatus.value === "0") {
    list = list.filter((c: any) => c.vat_type === "include");
  } else if (activeStatus.value === "1") {
    list = list.filter((c: any) => c.vat_type === "exclude");
  } else if (activeStatus.value === "2") {
    list = list.filter((c: any) => c.vat_type === "exempt");
  }

  // ถ้าอยากให้ค้นหาจาก ui ฝั่ง client เพิ่มเติม (นอกเหนือจากที่ server กรองแล้ว) ก็ปลดคอมเมนต์ด้านล่าง
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (p: any) =>
        (p.name ?? "").toLowerCase().includes(q) ||
        (p.sku ?? "").toLowerCase().includes(q)
    );
  }
  return list;
});

// TanStack table: ใช้ข้อมูลที่ “แบ่งหน้าแล้ว” จาก server
const data = filteredProducts; // <- reactive ref/comp
</script>

<template>
  <div class="w-full">
    <div>
      <div class="flex justify-between" v-if="screenSize === 'desktop'"></div>
      <Select v-else v-model="activeStatus">
        <SelectTrigger><SelectValue placeholder="ทั้งหมด" /></SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="0">รวมภาษี</SelectItem>
            <SelectItem value="1">ยังไม่รวมภาษี</SelectItem>
            <SelectItem value="2">ไม่รวมภาษี</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <!-- ตาราง (desktop) -->
    <ScrollArea
      v-if="screenSize === 'desktop'"
      class="max-h-[calc(100dvh-theme(spacing.20))] overflow-y-auto"
    >
      <BaseDataTable
        :column-name="colName"
        :data="data"
        div-classname="min-h-0 max-h-[calc(100vh-theme(spacing.40)-4.5rem)]"
        :action="CatalogTableDropdown"
      >
        <template #tabs>
          <Select v-model="activeStatus">
            <SelectTrigger><SelectValue placeholder="ทั้งหมด" /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="0">รวมภาษี</SelectItem>
                <SelectItem value="1">ยังไม่รวมภาษี</SelectItem>
                <SelectItem value="2">ไม่รวมภาษี</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </template>
      </BaseDataTable>
    </ScrollArea>

    <!-- การ์ด (mobile) -->
    <div
      class="mt-2 max-h-[calc(100vh-theme(spacing.40)-1rem)] overflow-y-auto"
      v-else
    >
      <Tabs v-model="activeStatus">
        <TabsContent
          v-for="tab in ['all', '0', '1', '2']"
          :value="tab"
          class="p-0 m-0"
        >
          <BaseCard
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            :value="`item-${product.id}`"
            class="px-2 py-4 m-0 overflow-x-hidden"
          >
            <div>
              <div class="flex items-center gap-4 w-full relative m-0">
                <div
                  :class="[
                    'absolute h-[calc(100%+2rem)] w-1 left-[-0.55rem]',
                    product.vat_type === 'include' ||
                    product.vat_type === 'exclude'
                      ? 'bg-primary-500'
                      : 'bg-green-500',
                  ]"
                />
                <Checkbox :id="`checkbox-${product.id}`" class="ml-2" />
                <div class="flex items-start overflow-hidden min-w-0 mb-3">
                  <div
                    class="truncate overflow-x-hidden whitespace-nowrap min-w-0"
                  >
                    <span class="text-sm text-muted-foreground mr-5">
                      {{ product.name }}
                    </span>
                    <Badge
                      :class="[
                        product.vat_type === 'include' ||
                        product.vat_type === 'exclude'
                          ? 'bg-primary-500'
                          : 'bg-green-500',
                      ]"
                    >
                      {{
                        product.vat_type === "exempt"
                          ? "ไม่รวมภาษี"
                          : product.vat_type === "include"
                          ? "รวมภาษี"
                          : "ยังไม่รวมภาษี"
                      }}
                    </Badge>
                  </div>
                </div>
                <p
                  class="absolute left-10 bottom-[-.5rem] flex flex-nonw gap-2 items-center text-[.8rem] font-normal text-muted-foreground truncate text-muted-600 dark:text-muted-400 w-full"
                >
                  <strong>SKU :</strong> {{ product.sku }}
                  <span><strong>ราคา :</strong> {{ product.price }} บาท</span>
                </p>
                <div class="ml-auto">
                  <CatalogTableDropdown :data="product" />
                </div>
              </div>
            </div>
          </BaseCard>
        </TabsContent>
      </Tabs>
    </div>

    <!-- แถบสรุป + เปลี่ยนหน้า (server-side) -->
    <div
      v-if="screenSize === 'desktop'"
      class="flex items-center justify-end gap-2 py-4"
    >
      <div class="flex-1 text-sm text-muted-foreground">
        ทั้งหมด {{ total }} รายการ • หน้า {{ page }} • ต่อหน้า {{ perPage }}
      </div>

      <!-- ตัวอย่างตัวเลือก perPage (ถ้ายังไม่มีที่อื่น) -->
      <Select
        class="border rounded px-2 py-1 text-sm"
        v-model="perPage"
        @change="perPage = parseInt(($event.target as HTMLSelectElement).value)"
      >
        <SelectTrigger>{{ perPage }}</SelectTrigger>
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
        <BaseButton
          variant="outline"
          size="sm"
          :disabled="page <= 1 || pending"
          @click="page = Math.max(1, page - 1)"
        >
          ก่อนหน้า
        </BaseButton>
        <BaseButton
          variant="outline"
          size="sm"
          :disabled="page * perPage >= total || pending"
          @click="page = page + 1"
        >
          ถัดไป
        </BaseButton>
      </div>
    </div>

    <div v-if="error" class="text-red-600 text-sm">
      เกิดข้อผิดพลาดในการโหลดข้อมูล
    </div>
  </div>
</template>
