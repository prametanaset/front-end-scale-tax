<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { Input } from "@/components/ui/input";
import { Trash, Plus } from "lucide-vue-next";

const products = ref<any[]>([]);
const isPopoverOpen = ref(false);
const isDialogOpen = ref(false);
const lastAddedProductId = ref<number | null>(null);

const availableProducts = ref([
  {
    id: 1,
    name: "สินค้า A",
    sku: "SKU001",
    price: 100,
    taxType: "include",
    product_image: { url: "https://i.pravatar.cc/100" },
  },
  {
    id: 2,
    name: "สินค้า B",
    sku: "SKU002",
    price: 200,
    taxType: "exclude",
    product_image: { url: "https://i.pravatar.cc/100" },
  },
  {
    id: 3,
    name: "สินค้า C",
    sku: "SKU003",
    price: 300,
    taxType: "exempt",
    product_image: { url: "https://i.pravatar.cc/100" },
  },
]);

const handleCreateProduct = async (product: any) => {
  try {
    const newId = Math.max(...availableProducts.value.map((p) => p.id)) + 1;
    const newProduct = {
      ...product,
      id: newId,
      product_image: { url: "https://i.pravatar.cc/100" },
    };
    availableProducts.value.push(newProduct);
    isDialogOpen.value = false;
  } catch (err) {
    console.error("❌ Error creating product:", err);
  }
};

const addProduct = (selectedProduct: any) => {
  const existing = products.value.find((p) => p.id === selectedProduct.id);
  if (existing) {
    existing.quantity += 1;
    lastAddedProductId.value = existing.id;
  } else {
    const newProduct = {
      ...selectedProduct,
      quantity: 1,
      discountValue: 0,
      discountType: "%",
      taxType: selectedProduct.taxType || "include",
      unit: "ชิ้น",
    };
    products.value.push(newProduct);
    lastAddedProductId.value = newProduct.id;
  }

  isPopoverOpen.value = false;

  nextTick(() => {
    const el = document.querySelector(`#product-${lastAddedProductId.value}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
};

const removeProduct = (id: number) => {
  products.value = products.value.filter((p) => p.id !== id);
};

const screenWidth = ref(0);
const updateWidth = () => {
  screenWidth.value = window.innerWidth;
};
onMounted(() => {
  updateWidth();
  window.addEventListener("resize", updateWidth);
});
onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

const currencyFormat = (value: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(value);

watch(
  products,
  (newVal) => {
    newVal.forEach((p) => {
      p.tax = p.taxType === "exempt" ? "0%" : "7%";
    });
  },
  { deep: true }
);
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <!-- <div
      class="grid grid-cols-[1fr_95px_40px_190px_50px_50px] gap-4 p-2 py-1 font-base border-b text-base items-center max-sm:hidden"
    >
      <span>รายละเอียด</span>
      <span class="text-center">จำนวน</span>
      <span class="text-center">ส่วนลด</span>
      <span class="text-center">ภาษี</span>
      <span class="text-center">รวม</span>
      <span class="text-center"></span>
    </div> -->
  <Table class="overflow-hidden">
    <TableHeader>
      <TableRow>
        <TableHead>สินค้า</TableHead>
        <TableHead>จำนวน</TableHead>
        <TableHead>ส่วนลด</TableHead>
        <TableHead>ภาษี</TableHead>
        <TableHead>รวม</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>

    <transition-group tag="tbody" name="fade-slide">
      <TableRow
        v-for="product in products"
        :key="product.id"
        class="transition-all duration-300"
      >
        <!-- Product Info -->
        <TableCell>
          <div class="flex items-center gap-3">
            <img
              :src="product.product_image.url"
              :alt="product.sku"
              class="w-12 h-12 rounded-xl object-cover"
            />
            <div class="min-w-0">
              <p class="font-semibold truncate">{{ product.name }}</p>
              <p class="text-sm text-gray-500">SKU: {{ product.sku }}</p>
            </div>
          </div>
        </TableCell>

        <!-- Quantity -->
        <TableCell>
          <Input
            type="number"
            v-model="product.quantity"
            min="1"
            class="w-20 text-center"
          />
        </TableCell>

        <!-- Discount -->
        <TableCell>
          {{ product.discountValue }} {{ product.discountType }}
        </TableCell>

        <!-- Tax -->
        <TableCell>
          {{ product.taxType === 'exempt' ? '0%' : '7%' }}
        </TableCell>

        <!-- Subtotal -->
        <TableCell>
          {{ currencyFormat(product.price * product.quantity) }}
        </TableCell>

        <!-- Delete -->
        <TableCell class="text-right">
          <BaseButton
            variant="ghost"
            class="text-red-500 hover:text-red-600"
            @click="removeProduct(product.id)"
          >
            <Trash class="w-5 h-5" />
          </BaseButton>
        </TableCell>
      </TableRow>
    </transition-group>
  </Table>
    <!-- Add Product Button -->
    <Popover v-if="!products.length">
      <PopoverTrigger as-child>
        <BaseButton class="flex items-center gap-2 px-3 text-left">
          <Plus /> <span>เพิ่มรายการสินค้า</span>
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent class="p-0" align="start">
        <Command>
          <CommandInput placeholder="ค้นหาสินค้า" />
          <CommandList>
            <CommandEmpty>ไม่พบสินค้า</CommandEmpty>
            <CommandGroup class="max-h-[300px] overflow-y-auto relative">
              <CommandItem
                :value="'new-product'"
                @select="isDialogOpen = true"
                class="sticky -top-1 z-10 bg-white dark:bg-[hsl(var(--popover))] shadow-sm px-4 py-2 flex items-center text-primary-500 cursor-pointer"
              >
                <Plus class="w-5 h-5 mr-3" />
                <span>เพิ่มสินค้าใหม่</span>
              </CommandItem>
              <CommandItem
                v-for="product in availableProducts"
                :key="product.id"
                @select="addProduct(product)"
                :value="product.id"
                class="flex items-center px-4 py-2 cursor-pointer"
              >
                <img
                  :src="product.product_image.url"
                  class="w-10 h-10 rounded-md object-cover mr-3"
                />
                <div>
                  <p class="font-medium">{{ product.name }}</p>
                  <p class="text-sm text-gray-500">
                    {{ currencyFormat(product.price) }} บาท
                  </p>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

    <!-- Add More Button -->
    <Popover v-if="products.length" v-model:open="isPopoverOpen">
      <PopoverTrigger as-child>
        <BaseButton class="flex items-center gap-2 text-left" variant="link">
          <Plus />
          <span>เพิ่มรายการสินค้า</span>
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent class="p-0 w-72" align="start">
        <Command>
          <CommandInput placeholder="ค้นหาสินค้า" />
          <CommandList>
            <CommandEmpty>ไม่พบสินค้า</CommandEmpty>
            <CommandGroup class="max-h-[300px] overflow-y-auto relative">
              <CommandItem
                :value="'new-product'"
                @select="isDialogOpen = true"
                class="sticky -top-1 z-10 shadow-sm px-4 py-2 flex items-center text-primary-500 cursor-pointer"
              >
                <Plus class="w-5 h-5 mr-3" />
                <span>เพิ่มสินค้าใหม่</span>
              </CommandItem>
              <CommandItem
                v-for="product in availableProducts"
                :key="product.id"
                @select="addProduct(product)"
                :value="product.id"
                class="flex items-center px-4 py-2 cursor-pointer"
              >
                <img
                  :src="product.product_image.url"
                  class="w-10 h-10 rounded-md object-cover mr-3"
                />
                <div>
                  <p class="font-medium">{{ product.name }}</p>
                  <p class="text-sm text-gray-500">
                    {{ currencyFormat(product.price) }} บาท
                  </p>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

    <!-- Dialog for New Product -->
    <BaseAddProductDialog
      v-model="isDialogOpen"
      mode="create"
      @product-added="handleCreateProduct"
    />
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.1s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
