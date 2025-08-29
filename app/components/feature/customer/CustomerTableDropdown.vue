<script setup lang="ts">
import {
  CircleEllipsis,
  Edit,
  EllipsisVertical,
  History,
  Trash,
} from "lucide-vue-next";
import type { CustomerTableRow } from "~/composables/types/customer";
import CustomerProfileDialog from "./CustomerProfileDialog.vue";
import CustomerDialogManage from "./CustomerManageDialog.vue";

const props = defineProps<{
  data: CustomerTableRow;
}>();

const detailActive = ref(false);
const editActive = ref(false);
const tabsActive = ref<"account" | "etax-history">("account");
</script>

<template>
  <div class="">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" class="cursor-pointer"
          ><EllipsisVertical /> </Button
      ></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          class="cursor-pointer"
          @click="(detailActive = true), (tabsActive = 'account')"
        >
          <CircleEllipsis />รายละเอียด</DropdownMenuItem
        >
        <DropdownMenuItem
          class="cursor-pointer"
          @click="(detailActive = true), (tabsActive = 'etax-history')"
        >
          <History />ประวัติการออกใบกำกับภาษี</DropdownMenuItem
        >
        <DropdownMenuItem class="cursor-pointer" @click="editActive = true"
          ><Edit /> แก้ไข</DropdownMenuItem
        >
        <Separator class="my-1" />
        <DropdownMenuItem class="cursor-pointer"><Trash /> ลบ</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <CustomerDialogManage
      v-model="editActive"
      mode="edit"
      :customer="props.data"
    />
    <CustomerProfileDialog
      v-model="detailActive"
      :customer="props.data"
      :tabActive="tabsActive"
    />
  </div>
</template>
