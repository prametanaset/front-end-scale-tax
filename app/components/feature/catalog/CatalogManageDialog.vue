<template>
  <Dialog :open="modelValue" @update:open="emit('update:modelValue', $event)">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>
          {{ mode === "edit" ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่" }}
        </DialogTitle>
        <DialogDescription>
          กรอกรายละเอียดสินค้า เลือกรูปแบบภาษี แล้วตรวจสอบราคาสุทธิ
        </DialogDescription>
      </DialogHeader>

      <Card class="border shadow-sm rounded-lg">
        <CardContent class="py-6 px-4 space-y-5">
          <!-- รหัส -->
          <div class="space-y-2">
            <Label for="name">รหัสสินค้า</Label>
            <Input id="name" v-model="newProduct.sku" />
          </div>
          <!-- ชื่อสินค้า -->
          <div class="space-y-2">
            <Label for="name">ชื่อสินค้า</Label>
            <Input id="name" v-model="newProduct.name" />
          </div>

          <!-- ราคาขาย -->
          <div class="space-y-2">
            <Label for="price">ราคาขาย</Label>
            <Input id="price" type="number" v-model="newProduct.price" />
          </div>

          <!-- ประเภทภาษี -->
          <div class="space-y-2">
            <Label>ประเภทภาษี</Label>
            <Select v-model="newProduct.taxType">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="เลือกภาษี" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="include">รวม VAT 7%</SelectItem>
                <SelectItem value="exclude">ไม่รวม VAT</SelectItem>
                <SelectItem value="exempt">ยกเว้นภาษี</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- ลิงก์รูป -->
          <div class="space-y-2">
            <Label for="image">ลิงก์รูป</Label>
            <Input id="image" v-model="newProduct.image" placeholder="URL" />
          </div>

          <!-- รูปภาพ -->
          <div class="flex justify-center">
            <div v-if="newProduct.image" class="w-32 h-32">
              <img
                :src="newProduct.image"
                alt="preview"
                class="w-32 h-32 object-cover rounded-md border shadow"
              />
            </div>
            <div
              v-else
              class="w-32 h-32 flex items-center justify-center text-gray-500 bg-gray-50 rounded-md border border-dashed"
            >
              ยังไม่มีรูปสินค้า
            </div>
          </div>

          <!-- ราคาสุทธิ -->
          <div class="text-center mt-4">
            <Badge variant="outline">
              {{
                newProduct.taxType === "include"
                  ? "รวม VAT"
                  : newProduct.taxType === "exclude"
                  ? "ไม่รวม VAT"
                  : "ยกเว้นภาษี"
              }}
            </Badge>
            <div class="mt-2 text-lg font-bold">
              ราคาสุทธิ:
              {{
                calculatedPrice.toLocaleString("th-TH", {
                  style: "currency",
                  currency: "THB",
                })
              }}
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogFooter class="pt-6">
        <DialogClose as-child>
          <BaseButton type="button" variant="outline">ยกเลิก</BaseButton>
        </DialogClose>
        <BaseButton @click="handleSave">
          {{ mode === "edit" ? "บันทึกการแก้ไข" : "เพิ่มสินค้า" }}
        </BaseButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { BaseButton } from "#components";
import { computed, ref } from "vue";
import type { Product } from "~/composables/types/product";

const props = defineProps<{
  modelValue: boolean;
  mode: "create" | "edit";
  product?: Product;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const newProduct = ref({
  sku: "",
  name: "",
  price: 0,
  taxType: "include",
  image: "",
});

// Computed property for calculated price
const calculatedPrice = computed(() => {
  const price = Number(newProduct.value.price) || 0;
  if (newProduct.value.taxType === "include") {
    // Price includes VAT 7%
    return price;
  } else if (newProduct.value.taxType === "exclude") {
    // Add VAT 7%
    return price * 1.07;
  } else {
    // Exempt: no VAT
    return price;
  }
});

// Add handleSave method
function handleSave() {
  emit("update:modelValue", false); // Close dialog after save
}

watch(
  () => props.product,
  (newVal) => {
    if (props.mode === "edit" && newVal) {
      newProduct.value = {
        sku: newVal.sku,
        name: newVal.name,
        price: newVal.price,
        taxType: newVal.vat_type,
        image: newVal.product_image?.url || "",
      };
    } else {
      newProduct.value = {
        sku: "",
        name: "",
        price: 0,
        taxType: "include",
        image: "",
      };
    }
  },
  { immediate: true }
);
</script>

<style></style>
