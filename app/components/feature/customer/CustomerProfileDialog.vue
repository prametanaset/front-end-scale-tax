<!-- BaseDialog.vue -->
<template>
  <Dialog :open="modelValue" @update:open="emit('update:modelValue', $event)">
    <DialogTrigger as-child></DialogTrigger>
    <DialogContent class="sm:max-w-[70vw] sm:h-[80vh] h-dvh flex flex-col">
      <DialogHeader>
        <DialogTitle>รายละเอียดลูกค้า</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <!-- Tabs Section -->
      <div class="flex-1 flex flex-col items-start">
        <Tabs v-model="active" class="w-full">
          <TabsList class="justify-start">
            <TabsTrigger value="account">รายละเอียด</TabsTrigger>
            <TabsTrigger value="etax-history">
              <History />
              ประวัติการออกใบกำกับภาษี
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div class="rounded-md overflow-hidden h-full flex flex-col gap-13">
              <div
                class="cover bg-linear-to-bl from-violet-500 to-fuchsia-500 w-full h-35 relative"
              >
                <Avatar class="w-25 h-25 absolute bottom-[-2rem] left-6">
                  <AvatarImage src="https://i.pravatar.cc/100" alt="@unovue" />
                  <AvatarFallback>{{ customer.name }}</AvatarFallback>
                </Avatar>
              </div>
              <div class="">
                <div class="grid grid-cols-2 gap-4 space-y-4">
                  <div class="flex-1">
                    <Label for="taxId">ชื่อ</Label>
                    <Input
                      id="taxId"
                      v-model="customer.first_name"
                      placeholder="13 หลัก"
                    />
                  </div>
                  <div class="flex-1">
                    <Label for="taxId">นามสกุล</Label>
                    <Input
                      id="taxId"
                      v-model="customer.last_name"
                      placeholder="13 หลัก"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="etax-history">etax</TabsContent>
        </Tabs>
      </div>

      <DialogFooter></DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History, PersonStanding, Search, User } from "lucide-vue-next";
import type { Customer, CustomerTableRow } from "~/composables/types/customer";

const props = defineProps<{
  customer: CustomerTableRow;
  modelValue: boolean;
  tabActive: "account" | "etax-history";
}>();
const customerStore = useCustomerStore();
import { ref, watch } from "vue";

const active = ref(props.tabActive);

const customerData = customerStore.customersList.find(
  (c) => c.id === props.customer.id
) as Customer;

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

watch(
  () => props.tabActive,
  (newValue) => {
    active.value = newValue;
  }
);
</script>
