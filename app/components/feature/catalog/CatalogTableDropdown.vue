<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-vue-next";
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="ghost" class="cursor-pointer"
        ><EllipsisVertical /> </Button
    ></DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem class="cursor-pointer">รายละเอียด</DropdownMenuItem>
      <DropdownMenuItem class="cursor-pointer">แก้ไข</DropdownMenuItem>
      <DropdownMenuItem class="cursor-pointer">ลบ</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
