<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleEllipsis, Edit, EllipsisVertical, Trash } from "lucide-vue-next";
import type { CustomerTableRow } from "~/composables/types/customer";

const props = defineProps<{
  customer: CustomerTableRow;
}>();

const detailActive = ref(false);
const editActive = ref(false);
</script>

<template>
  <div class="">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" class="cursor-pointer"
          ><EllipsisVertical /> </Button
      ></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem class="cursor-pointer" @click="detailActive = true">
          <CircleEllipsis />รายละเอียด</DropdownMenuItem
        >
        <DropdownMenuItem class="cursor-pointer" @click="editActive = true"
          ><Edit /> แก้ไข</DropdownMenuItem
        >
        <Separator />
        <DropdownMenuItem class="cursor-pointer text-red-800"
          ><Trash class="text-red-800" /> ลบ</DropdownMenuItem
        >
      </DropdownMenuContent>
    </DropdownMenu>
    <FeatureCustomerDialogManagement
      v-model="editActive"
      mode="edit"
      :customer="props.customer"
    />
    <BaseDialog
      v-model="detailActive"
      title="รายละเอียด"
      :show-button="false"
    />
  </div>
</template>
