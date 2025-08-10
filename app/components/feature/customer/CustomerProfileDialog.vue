<!-- BaseDialog.vue -->
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
            <div class="rounded-md overflow-hidden h-full flex flex-col gap-10">
              <div
                class="rounded-md cover bg-linear-to-bl from-violet-500 to-fuchsia-500 w-full h-35 relative"
              >
                <Avatar class="w-25 h-25 absolute bottom-[-2rem] left-6">
                  <!-- <AvatarImage src="https://i.pravatar.cc/100" alt="@unovue" /> -->
                  <AvatarFallback v-if="customer.type === 'นิติบุคคล'">
                    {{ customer.name[0] }}{{ customer.name[1] }}</AvatarFallback
                  >
                  <AvatarFallback v-else
                    >{{ customer.first_name?.[0]
                    }}{{ customer.last_name?.[0] }}</AvatarFallback
                  >
                </Avatar>
              </div>

              <div class="border-md border-gray-500 sm:p-6 space-y-2 h-full">
                <BaseCard class="p-4">
                  <h2>ข้อมูลส่วนตัว</h2>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="">
                      <Label>ชื่อ</Label>
                      <p>{{ customer.name }}</p>
                    </div>
                    <div class="">
                      <Label>ประเภทลูกค้า</Label>
                      <p>{{ customer.type }}</p>
                    </div>
                    <div
                      :class="customer.type === 'นิติบุคคล' ? '' : 'col-span-2'"
                    >
                      <Label>หมายเลขผู้เสียภาษี</Label>
                      <p>{{ customer.tin }}</p>
                    </div>
                    <div v-if="customer.type === 'นิติบุคคล'" class="">
                      <Label>เลขสาขา</Label>
                      <p>{{ customer.branch_no }}</p>
                    </div>
                    <div class="">
                      <Label>อีเมล</Label>
                      <p>{{ customer.email }}</p>
                    </div>
                    <div class="">
                      <Label>เบอร์ติดต่อ</Label>
                      <p>{{ customer.phone }}</p>
                    </div>
                  </div>
                </BaseCard>

                <BaseCard class="p-4">
                  <h2>ที่อยู่</h2>
                  <div class="">
                    <p>{{ customer.address }}</p>
                  </div>
                </BaseCard>
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
