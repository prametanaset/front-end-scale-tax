<template>
  <div class="flex flex-col gap-4 h-full min-h-0">
    <div class="flex items-center gap-2 flex-wrap">
      <Label class="text-lg font-semibold mr-auto">รายการสินค้า</Label>

      <Popover v-model:open="addOpen">
        <PopoverTrigger as-child>
          <BaseButton class="gap-2"><Plus class="w-4 h-4" /> เพิ่มสินค้า</BaseButton>
        </PopoverTrigger>
        <PopoverContent class="p-0 w-[420px]" align="end" :avoid-collisions="false">
          <Command>
            <CommandInput v-model="query" placeholder="ค้นหาชื่อ/รหัสสินค้า…" />
            <CommandList>
              <CommandEmpty>ไม่พบสินค้า</CommandEmpty>
              <CommandGroup class="max-h-[300px] overflow-y-auto">
                <CommandItem
                  v-for="p in filteredAvailable"
                  :key="p.id"
                  :value="String(p.id)"
                  class="px-3 py-2 cursor-pointer"
                  @select="() => { addProduct(p); addOpen=false; }"
                >
                  <div class="flex items-center gap-3">
                    <img :src="p.product_image.url" alt="" class="w-10 h-10 rounded-md object-cover" />
                    <div class="min-w-0">
                      <p class="font-medium truncate">{{ p.name }}</p>
                      <p class="text-xs text-muted-foreground">SKU: {{ p.sku }}</p>
                    </div>
                    <span class="ml-auto text-sm">{{ currency(p.price) }} ฿</span>
                  </div>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <BaseButton variant="outline" class="gap-2" :disabled="!products.length" @click="clearAll">
        ล้างรายการ
      </BaseButton>
    </div>

    <div v-if="!products.length" class="flex flex-col items-center justify-center py-10 border border-dashed rounded-lg">
      <p class="text-sm text-muted-foreground mb-4">ยังไม่มีสินค้าในรายการ</p>
      <BaseButton class="gap-2" @click="addOpen = true"><Plus class="w-4 h-4" /> เพิ่มสินค้าแรก</BaseButton>
    </div>

    <div v-else class="flex gap-6 min-h-0 flex-1">
  <div class="flex-1 min-h-0">
    <!-- Mobile layout: Card list -->
    <div class="md:hidden space-y-3">
      <div
        v-for="(product, idx) in products"
        :key="product.id"
        :id="`product-${product.id}`"
        class="rounded-lg border bg-[hsl(var(--card))] p-3"
      >
        <div class="flex items-center gap-3">
          <img
            :src="product.product_image.url"
            :alt="product.sku"
            class="w-12 h-12 rounded-xl object-cover"
            width="48" height="48"
            loading="lazy" decoding="async"
          />
          <div class="min-w-0">
            <p class="font-medium truncate">{{ product.name }}</p>
            <p class="text-xs text-muted-foreground truncate">SKU: {{ product.sku }}</p>
            <p class="text-xs text-muted-foreground">
              {{ currency(product.price) }} ฿ / {{ product.unit }}
            </p>
          </div>
          <BaseButton
            variant="ghost"
            size="icon"
            class="ml-auto"
            @click="removeProduct(product.id)"
            aria-label="ลบรายการ"
          >
            <Trash class="w-5 h-5 text-red-500" />
          </BaseButton>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-3">
          <div class="col-span-2">
            <Label class="text-xs text-muted-foreground mb-1 block">จำนวน</Label>
            <NumberField v-model="product.quantity" :min="1" :step="1" class="w-full">
              <NumberFieldContent>
                <NumberFieldDecrement aria-label="ลดจำนวน" />
                <NumberFieldInput class="text-center" />
                <NumberFieldIncrement aria-label="เพิ่มจำนวน" />
              </NumberFieldContent>
            </NumberField>
          </div>

          <div>
            <Label class="text-xs text-muted-foreground mb-1 block">ส่วนลด</Label>
            <NumberField v-model="product.discountValue" :min="0" :step="1" class="w-full">
              <NumberFieldInput class="text-right" placeholder="0" />
            </NumberField>
          </div>

          <div>
            <Label class="text-xs text-muted-foreground mb-1 block">รูปแบบ</Label>
            <Select v-model="product.discountType">
              <SelectTrigger class="h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="%">%</SelectItem>
                <SelectItem value="฿">฿</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="col-span-2">
            <Label class="text-xs text-muted-foreground mb-1 block">ภาษี</Label>
            <Select v-model="product.taxType">
              <SelectTrigger class="h-9 w-full">
                <SelectValue placeholder="ภาษี" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="include">รวมภาษี</SelectItem>
                <SelectItem value="exclude">ไม่รวมภาษี</SelectItem>
                <SelectItem value="exempt">ยกเว้นภาษี</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="mt-3 flex items-center justify-between">
          <span class="text-sm text-muted-foreground">รวม</span>
          <span class="tabular-nums font-semibold">{{ currency(lineTotal(product)) }} ฿</span>
        </div>
      </div>
    </div>

    <!-- Desktop/Tablet layout: Sticky header table -->
    <div class="hidden md:block rounded-lg border overflow-hidden h-full min-h-0">
      <div class="flex flex-col h-full min-h-0">
        <!-- หัวตาราง sticky -->
        <div class="overflow-x-auto">
          <Table class="table-fixed">
            <colgroup>
              <col style="width:42%" />
              <col style="width:14%" />
              <col style="width:16%" />
              <col style="width:12%" />
              <col style="width:16%" />
            </colgroup>
            <TableHeader class="bg-[hsl(var(--card))] sticky top-0 z-10">
              <TableRow>
                <TableHead>สินค้า</TableHead>
                <TableHead>จำนวน</TableHead>
                <TableHead>ส่วนลด</TableHead>
                <TableHead>ภาษี</TableHead>
                <TableHead class="text-right">รวม</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <!-- ตัวตารางเลื่อนในแนวตั้ง -->
        <div class="flex-1 min-h-0 overflow-auto">
          <div class="overflow-x-auto h-full">
            <Table class="table-fixed">
              <colgroup>
                <col style="width:42%" />
                <col style="width:14%" />
                <col style="width:16%" />
                <col style="width:12%" />
                <col style="width:16%" />
              </colgroup>
              <TableBody>
                <TableRow
                  v-for="(product, idx) in products"
                  :key="product.id"
                  :id="`product-${product.id}`"
                  class="group"
                >
                  <TableCell>
                    <div class="flex items-center gap-3">
                      <img
                        :src="product.product_image.url"
                        :alt="product.sku"
                        class="w-12 h-12 rounded-xl object-cover"
                        width="48" height="48"
                        loading="lazy" decoding="async"
                      />
                      <div class="min-w-0">
                        <p class="font-medium truncate">{{ product.name }}</p>
                        <p class="text-xs text-muted-foreground truncate">SKU: {{ product.sku }}</p>
                        <p class="text-xs text-muted-foreground">
                          {{ currency(product.price) }} ฿ / {{ product.unit }}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <NumberField v-model="product.quantity" :min="1" :step="1" class="w-[130px]">
                      <NumberFieldContent>
                        <NumberFieldDecrement aria-label="ลดจำนวน" />
                        <NumberFieldInput class="text-center" />
                        <NumberFieldIncrement aria-label="เพิ่มจำนวน" />
                      </NumberFieldContent>
                    </NumberField>
                  </TableCell>

                  <TableCell>
                    <div class="flex items-center gap-2">
                      <NumberField v-model="product.discountValue" :min="0" :step="1" class="w-[120px]">
                        <NumberFieldInput class="text-right" placeholder="0" />
                      </NumberField>

                      <Select v-model="product.discountType">
                        <SelectTrigger class="h-9 w-[72px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="%">%</SelectItem>
                          <SelectItem value="฿">฿</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Select v-model="product.taxType">
                      <SelectTrigger class="h-9 w-full">
                        <SelectValue placeholder="ภาษี" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="include">รวมภาษี</SelectItem>
                        <SelectItem value="exclude">ไม่รวมภาษี</SelectItem>
                        <SelectItem value="exempt">ยกเว้นภาษี</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell class="text-right align-middle">
                    <div class="flex items-center justify-end gap-2">
                      <span class="tabular-nums font-medium">
                        {{ currency(lineTotal(product)) }} ฿
                      </span>
                      <BaseButton
                        variant="ghost"
                        size="icon"
                        class="opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="removeProduct(product.id)"
                        aria-label="ลบรายการ"
                      >
                        <Trash class="w-5 h-5 text-red-500" />
                      </BaseButton>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- สรุปรายการ (ถ้าจะเปิดทีหลัง)… -->
</div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Trash } from "lucide-vue-next";


type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  taxType: "include" | "exclude" | "exempt";
  unit: string;
  product_image: { url: string };
  quantity: number;
  discountValue: number;
  discountType: "%" | "฿";
};

const availableProducts = ref<Product[]>([
  { id: 1, name: "สินค้า A", sku: "SKU001", price: 100, taxType: "include", unit: "ชิ้น", product_image: { url: "https://i.pravatar.cc/100?img=1" }, quantity: 0, discountValue: 0, discountType: "%" },
  { id: 2, name: "สินค้า B", sku: "SKU002", price: 200, taxType: "exclude", unit: "ชิ้น", product_image: { url: "https://i.pravatar.cc/100?img=2" }, quantity: 0, discountValue: 0, discountType: "%" },
  { id: 3, name: "สินค้า C", sku: "SKU003", price: 300, taxType: "exempt",  unit: "ชิ้น", product_image: { url: "https://i.pravatar.cc/100?img=3" }, quantity: 0, discountValue: 0, discountType: "%" },
  { id: 4, name: "สินค้า D", sku: "SKU004", price: 120, taxType: "include", unit: "ชิ้น", product_image: { url: "https://i.pravatar.cc/100?img=4" }, quantity: 0, discountValue: 0, discountType: "%" },
  { id: 5, name: "สินค้า E", sku: "SKU005", price: 150, taxType: "exclude", unit: "ชิ้น", product_image: { url: "https://i.pravatar.cc/100?img=5" }, quantity: 0, discountValue: 0, discountType: "%" },
  { id: 6, name: "สินค้า F", sku: "SKU006", price: 180, taxType: "include", unit: "ชิ้น", product_image: { url: "https://i.pravatar.cc/100?img=6" }, quantity: 0, discountValue: 0, discountType: "%" },
  { id: 7, name: "สินค้า G", sku: "SKU007", price: 220, taxType: "exempt",  unit: "ชิ้น", product_image: { url: "https://i.pravatar.cc/100?img=7" }, quantity: 0, discountValue: 0, discountType: "%" },
  { id: 8, name: "สินค้า H", sku: "SKU008", price: 170, taxType: "include", unit: "ชิ้น", product_image: { url: "https://i.pravatar.cc/100?img=8" }, quantity: 0, discountValue: 0, discountType: "%" },
  { id: 9, name: "สินค้า I", sku: "SKU009", price: 260, taxType: "exclude", unit: "ชิ้น", product_image: { url: "https://i.pravatar.cc/100?img=9" }, quantity: 0, discountValue: 0, discountType: "%" },
  { id: 10, name: "สินค้า J", sku: "SKU010", price: 190, taxType: "include", unit: "ชิ้น", product_image: { url: "https://i.pravatar.cc/100?img=10" }, quantity: 0, discountValue: 0, discountType: "%" },
  { id: 11, name: "สินค้า K", sku: "SKU011", price: 230, taxType: "exempt",  unit: "ชิ้น", product_image: { url: "https://i.pravatar.cc/100?img=11" }, quantity: 0, discountValue: 0, discountType: "%" },
  { id: 12, name: "สินค้า L", sku: "SKU012", price: 250, taxType: "include", unit: "ชิ้น", product_image: { url: "https://i.pravatar.cc/100?img=12" }, quantity: 0, discountValue: 0, discountType: "%" },
]);

const products = ref<Product[]>([]);
const addOpen = ref(false);
const query = ref("");

const filteredAvailable = computed(() =>
  availableProducts.value.filter(p =>
    (p.name + p.sku).toLowerCase().includes(query.value.trim().toLowerCase())
  )
);

function addProduct(p: Product) {
  const found = products.value.find(x => x.id === p.id);
  if (found) {
    found.quantity += 1;
  } else {
    products.value.push({ ...p, quantity: 1, discountValue: 0, discountType: "%", taxType: p.taxType ?? "include" });
  }
  nextTick(() => {
    const el = document.querySelector<HTMLElement>(`#product-${p.id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function removeProduct(id: number) {
  products.value = products.value.filter(x => x.id !== id);
}

function clearAll() {
  products.value = [];
}

function currency(n: number) {
  return new Intl.NumberFormat("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
}

function lineTotal(p: Product) {
  const qty = Math.max(1, Number(p.quantity) || 1);
  const price = Number(p.price) || 0;
  const disc = Number(p.discountValue) || 0;

  let afterDisc = price * qty;
  if (p.discountType === "%") {
    afterDisc -= (afterDisc * Math.min(100, Math.max(0, disc))) / 100;
  } else {
    afterDisc -= disc;
  }
  if (p.taxType === "exempt" || p.taxType === "include") {
    return Math.max(0, afterDisc);
  }
  return Math.max(0, afterDisc);
}

const subtotal = computed(() => products.value.reduce((s, p) => s + lineTotal(p), 0));

const vatAmount = computed(() => {
  const base = products.value
    .filter(p => p.taxType !== "exempt")
    .reduce((s, p) => s + lineTotal(p), 0);
  return Math.round(base * 0.07 * 100) / 100;
});

const grandTotal = computed(() => subtotal.value + vatAmount.value);
</script>

<style scoped>
.tabular-nums { font-variant-numeric: tabular-nums; }
</style>