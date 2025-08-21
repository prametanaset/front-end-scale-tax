<template>
  <Dialog :open="modelValue" @update:open="emit('update:modelValue', $event)">
    <DialogTrigger as-child></DialogTrigger>
    <DialogContent class="sm:max-w-[50vw] sm:h-[80vh] h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>รายละเอียดลูกค้า</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <!-- Tabs Section -->
      <div class="flex-1 flex flex-col items-start">
        <Tabs v-model="active" class="w-full">
          <TabsList class="justify-start w-full grid-cols-2">
            <TabsTrigger value="account">รายละเอียด</TabsTrigger>
            <TabsTrigger value="etax-history">
              <History />
              ประวัติการออกใบกำกับภาษี
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <ScrollArea
              class="rounded-md overflow-hidden h-[75vh] flex flex-col gap-5"
            >
              <div
                class="rounded-md cover bg-linear-to-bl from-violet-500 to-fuchsia-500 w-full h-35 relative"
              >
                <Avatar class="w-25 h-25 absolute bottom-[-1rem] left-6">
                  <AvatarImage src="https://i.pravatar.cc/100" alt="@unovue" />
                  <AvatarFallback v-if="customer.type === 'นิติบุคคล'">
                    {{ customer.name[0] }}{{ customer.name[1] }}</AvatarFallback
                  >
                  <AvatarFallback v-else
                    >{{ customer.first_name?.[0]
                    }}{{ customer.last_name?.[0] }}</AvatarFallback
                  >
                </Avatar>

                <BaseButton
                  class="absolute bottom-2 right-4"
                  type="button"
                  variant="outline"
                  @click="editActive = true"
                >
                  <Pen />
                  แก้ไข</BaseButton
                >

                <CustomerManageDialog
                  v-model="editActive"
                  mode="edit"
                  :customer="customer"
                />
              </div>

              <div class="border-md border-gray-500 sm:p-6 space-y-2 h-full">
                <div class="p-4 space-y-2">
                  <h2 class="font-bold">ข้อมูลส่วนตัว</h2>
                  <div class="grid sm:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <Label>ชื่อ</Label>
                      <BaseInput v-model="customer.name" disabled />
                    </div>
                    <div class="space-y-2">
                      <Label>ประเภทลูกค้า</Label>
                      <BaseInput v-model="customer.type" disabled />
                    </div>
                    <div
                      :class="[
                        customer.type === 'นิติบุคคล' ? '' : 'col-span-2',
                        'space-y-2',
                      ]"
                    >
                      <Label>หมายเลขผู้เสียภาษี</Label>
                      <BaseInput v-model="customer.tin" disabled />
                    </div>
                    <div v-if="customer.type === 'นิติบุคคล'" class="space-y-2">
                      <Label>เลขสาขา</Label>
                      <BaseInput v-model="customer.branch_no" disabled />
                    </div>
                    <div class="space-y-2">
                      <Label>อีเมล</Label>
                      <BaseInput v-model="customer.email" disabled />
                    </div>
                    <div class="space-y-2">
                      <Label>เบอร์ติดต่อ</Label>
                      <BaseInput v-model="customer.phone" disabled />
                    </div>
                  </div>
                </div>

                <div class="p-4 space-y-2">
                  <h2 class="font-bold">ที่อยู่</h2>
                  <div class="">
                    <Textarea
                      class="max-h-10"
                      v-model="customer.address"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
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
import { History, Pen, PersonStanding, Search, User } from "lucide-vue-next";
import type { Customer, CustomerTableRow } from "~/composables/types/customer";
import CustomerManageDialog from "./CustomerManageDialog.vue";

const props = defineProps<{
  customer: CustomerTableRow;
  modelValue: boolean;
  tabActive: "account" | "etax-history";
}>();
const customerStore = useCustomerStore();
import { ref, watch } from "vue";

const active = ref(props.tabActive);
const editActive = ref(false);

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
