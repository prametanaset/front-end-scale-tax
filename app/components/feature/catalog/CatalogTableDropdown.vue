<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleEllipsis, Edit, EllipsisVertical, Trash } from "lucide-vue-next";
import type { Product } from "~/composables/types/product";

const activeEditProduct = ref(false);

const props = defineProps<{
  product: Product;
}>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="ghost" class="cursor-pointer"
        ><EllipsisVertical /> </Button
    ></DropdownMenuTrigger>
    <DropdownMenuContent class="min-w-40">
      <DropdownMenuItem class="cursor-pointer"
        ><CircleEllipsis /> รายละเอียด</DropdownMenuItem
      >

      <DropdownMenuItem
        @click="activeEditProduct = true"
        class="cursor-pointer mb-1"
        ><Edit /> แก้ไข</DropdownMenuItem
      >
      <Separator />
      <DropdownMenuItem class="cursor-pointer"><Trash /> ลบ</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <FeatureCatalogManageDialog
    mode="edit"
    v-model="activeEditProduct"
    :product="props.product"
  />
</template>
