<template>
  <div class="space-y-4">
    <Label class="text-lg font-semibold">รายการสินค้า</Label>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">สินค้า</TableHead>
          <TableHead scope="col">จำนวน</TableHead>
          <TableHead scope="col">ส่วนลด</TableHead>
          <TableHead scope="col">ภาษี</TableHead>
          <TableHead scope="col">รวม</TableHead>
          <TableHead scope="col"></TableHead>
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
            {{ product.taxType === "exempt" ? "0%" : "7%" }}
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
                class="sticky -top-1 z-10  px-4 py-2 flex items-center cursor-pointer"
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
    <!-- <BaseAddProductDialog
      v-model="isDialogOpen"
      mode="create"
      @product-added="handleCreateProduct"
    /> -->
  </div>
</template>

<script setup lang="ts">
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
    product_image: { url: "https://i.pravatar.cc/100?img=1" },
  },
  {
    id: 2,
    name: "สินค้า B",
    sku: "SKU002",
    price: 200,
    taxType: "exclude",
    product_image: { url: "https://i.pravatar.cc/100?img=2" },
  },
  {
    id: 3,
    name: "สินค้า C",
    sku: "SKU003",
    price: 300,
    taxType: "exempt",
    product_image: { url: "https://i.pravatar.cc/100?img=3" },
  },
  {
    id: 4,
    name: "สินค้า D",
    sku: "SKU004",
    price: 120,
    taxType: "include",
    product_image: { url: "https://i.pravatar.cc/100?img=4" },
  },
  {
    id: 5,
    name: "สินค้า E",
    sku: "SKU005",
    price: 150,
    taxType: "exclude",
    product_image: { url: "https://i.pravatar.cc/100?img=5" },
  },
  {
    id: 6,
    name: "สินค้า F",
    sku: "SKU006",
    price: 180,
    taxType: "include",
    product_image: { url: "https://i.pravatar.cc/100?img=6" },
  },
  {
    id: 7,
    name: "สินค้า G",
    sku: "SKU007",
    price: 220,
    taxType: "exempt",
    product_image: { url: "https://i.pravatar.cc/100?img=7" },
  },
  {
    id: 8,
    name: "สินค้า H",
    sku: "SKU008",
    price: 170,
    taxType: "include",
    product_image: { url: "https://i.pravatar.cc/100?img=8" },
  },
  {
    id: 9,
    name: "สินค้า I",
    sku: "SKU009",
    price: 260,
    taxType: "exclude",
    product_image: { url: "https://i.pravatar.cc/100?img=9" },
  },
  {
    id: 10,
    name: "สินค้า J",
    sku: "SKU010",
    price: 190,
    taxType: "include",
    product_image: { url: "https://i.pravatar.cc/100?img=10" },
  },
  {
    id: 11,
    name: "สินค้า K",
    sku: "SKU011",
    price: 230,
    taxType: "exempt",
    product_image: { url: "https://i.pravatar.cc/100?img=11" },
  },
  {
    id: 12,
    name: "สินค้า L",
    sku: "SKU012",
    price: 250,
    taxType: "include",
    product_image: { url: "https://i.pravatar.cc/100?img=12" },
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
