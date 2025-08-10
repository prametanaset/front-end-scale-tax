<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CustomerTableRow } from "~/composables/types/customer";

const props = defineProps<{
  modelValue: boolean;
  mode: "create" | "edit";
  customer?: CustomerTableRow;
}>();

const localCustomer = reactive({
  name: props.customer?.name ?? "",
  type: props.customer?.type ?? "",
  tin: props.customer?.tin ?? "",
  branch_no: props.customer?.branch_no ?? "",
  email: props.customer?.email ?? "",
  phone: props.customer?.phone ?? "",
  address: props.customer?.address ?? "",
  first_name: props.customer?.first_name ?? "",
  last_name: props.customer?.last_name ?? "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const activeTab = ref<"person" | "corporate">("corporate");
</script>

<template>
  <Dialog :open="modelValue" @update:open="emit('update:modelValue', $event)">
    <!-- เปลี่ยนสี ความทึบ และเบลอของฉากหลังตรงนี้ -->

    <DialogContent
      class="sm:max-w-xl w-full max-h-[90dvh] bg-background overflow-hidden"
    >
      <div class="grid gap-6">
        <!-- Left: Tabs Form -->
        <div>
          <DialogHeader>
            <DialogTitle>{{
              props.mode === "edit" ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มข้อมูลลูกค้า"
            }}</DialogTitle>
            <DialogDescription>
              เลือกประเภทและกรอกข้อมูลให้ครบถ้วน
            </DialogDescription>
          </DialogHeader>

          <Tabs v-model="activeTab" class="w-full mt-4">
            <TabsList
              :class="[
                'grid w-full mb-4',
                props.mode === 'edit' ? 'grid-cols-1' : 'grid-cols-2',
              ]"
            >
              <!-- นิติบุคคล -->
              <TabsTrigger
                v-if="
                  props.mode === 'create' || localCustomer.type === 'นิติบุคคล'
                "
                value="corporate"
              >
                นิติบุคคล
              </TabsTrigger>

              <!-- บุคคลธรรมดา -->
              <TabsTrigger
                v-if="
                  props.mode === 'create' ||
                  localCustomer.type === 'บุคคลธรรมดา'
                "
                value="person"
              >
                บุคคลธรรมดา
              </TabsTrigger>
            </TabsList>

            <!-- Corporate (นิติบุคคล) -->
            <TabsContent value="corporate">
              <Card>
                <CardHeader>
                  <CardTitle>นิติบุคคล</CardTitle>
                  <CardDescription>
                    กรอกชื่อร้านค้าและเลขประจำตัวผู้เสียภาษี
                  </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div>
                    <BaseInput
                      id="storeName"
                      label="ชื่อร้านค้า"
                      v-model="localCustomer.name"
                      placeholder="ชื่อบริษัท / ร้านค้า"
                    />
                  </div>
                  <div class="flex gap-4">
                    <div class="flex-1">
                      <BaseInput
                        id="taxId"
                        label="เลขประจำตัวผู้เสียภาษี"
                        v-model="localCustomer.tin"
                        placeholder="13 หลัก"
                      />
                    </div>
                    <div class="w-[120px]">
                      <BaseInput
                        id="branchCode"
                        label="เลขที่สาขา"
                        v-model="localCustomer.branch_no"
                        placeholder="5 หลัก"
                        maxlength="5"
                      />
                    </div>
                  </div>
                  <div class="grid gap-4 grid-cols-2">
                    <div>
                      <BaseInput
                        id="email"
                        label="อีเมล"
                        v-model="localCustomer.email"
                        placeholder="ที่อยู่อีเมล"
                      />
                    </div>
                    <div>
                      <BaseInput
                        id="phone"
                        label="เบอร์โทรศัพท์"
                        v-model="localCustomer.phone"
                        placeholder="เบอร์ติดต่อ"
                      />
                    </div>
                  </div>
                  <div>
                    <div>
                      <Label class="mb-1 block text-sm font-medium">
                        ที่อยู่ร้านค้า <span class="text-red-500">*</span>
                      </Label>
                      <Textarea
                        v-model="localCustomer.address"
                        class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        rows="2"
                        placeholder="บ้านเลขที่ หมู่ ซอย ถนน"
                        required
                        maxlength="150"
                      />
                    </div>
                  </div>
                  <!-- <BaseLocationPicker
                    @location-data="handleSelectLocation"
                    :update-data="locationData"
                  /> -->
                </CardContent>
                <CardFooter class="flex justify-end">
                  <Button>บันทึก</Button>
                  <DialogClose as-child>
                    <Button variant="ghost">ปิด</Button>
                  </DialogClose>
                </CardFooter>
              </Card>
            </TabsContent>

            <!-- Personal (บุคคลธรรมดา) -->
            <TabsContent value="person">
              <Card>
                <CardHeader>
                  <CardTitle>บุคคลธรรมดา</CardTitle>
                  <CardDescription>
                    กรอกชื่อผู้ติดต่อและเลขบัตรประชาชน
                  </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="grid gap-4 grid-cols-2">
                    <div>
                      <BaseInput
                        id="firstName"
                        label="ชื่อจริง"
                        v-model="localCustomer.first_name"
                        placeholder="ชื่อจริง"
                      />
                    </div>
                    <div>
                      <BaseInput
                        id="lastName"
                        label="นามสกุล"
                        v-model="localCustomer.last_name"
                        placeholder="นามสกุล"
                      />
                    </div>
                  </div>
                  <div class="flex gap-4">
                    <div class="flex-1">
                      <BaseInput
                        id="taxId"
                        label="เลขบัตรประชาชน"
                        v-model="localCustomer.tin"
                        placeholder="13 หลัก"
                      />
                    </div>
                  </div>
                  <div class="grid gap-4 grid-cols-2">
                    <div>
                      <BaseInput
                        id="email"
                        label="อีเมล"
                        v-model="localCustomer.email"
                        placeholder="ที่อยู่อีเมล"
                      />
                    </div>
                    <div>
                      <BaseInput
                        id="phone"
                        label="เบอร์โทรศัพท์"
                        v-model="localCustomer.phone"
                        placeholder="เบอร์ติดต่อ"
                      />
                    </div>
                  </div>
                  <div>
                    <div>
                      <Label class="mb-1 block text-sm font-medium">
                        ที่อยู่ร้านค้า <span class="text-red-500">*</span>
                      </Label>
                      <Textarea
                        v-model="localCustomer.address"
                        class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        rows="2"
                        placeholder="บ้านเลขที่ หมู่ ซอย ถนน"
                        required
                        maxlength="150"
                      />
                    </div>
                  </div>
                  <!-- <BaseLocationPicker
                    @location-data="handleSelectLocation"
                    :update-data="locationData"
                  /> -->
                </CardContent>
                <CardFooter class="flex justify-end">
                  <BaseButton class="rounded-md">บันทึก</BaseButton>
                  <DialogClose as-child>
                    <BaseButton variant="ghost" class="rounded-md">ปิด</BaseButton>
                  </DialogClose>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
