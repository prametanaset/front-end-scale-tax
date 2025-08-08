<script setup lang="ts">
import { ChevronsUpDown, Search, Plus } from "lucide-vue-next";

// Type for customer
type Customer = {
  ID: number;
  StoreId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Address: string;
  CreatedAt: string;
  UpdatedAt: string;
  ImgUrl?: string; // Optional field for customer image URL
};

// ✅ Static customer data
const customers = ref<Customer[]>([
  {
    ID: 1,
    StoreId: 101,
    FirstName: "John",
    LastName: "Doe",
    Email: "john.doe@example.com",
    Phone: "0123456789",
    Address: "123 Main Street",
    CreatedAt: "2024-01-01T12:00:00Z",
    UpdatedAt: "2024-01-01T12:00:00Z",
    ImgUrl: "https://i.pravatar.cc/100",
  },
  {
    ID: 2,
    StoreId: 102,
    FirstName: "Jane",
    LastName: "Smith",
    Email: "jane.smith@example.com",
    Phone: "0987654321",
    Address: "456 Second Ave",
    CreatedAt: "2024-02-01T08:00:00Z",
    UpdatedAt: "2024-02-01T08:00:00Z",
    ImgUrl: "https://i.pravatar.cc/100",
  },
]);

const value = ref<Customer | null>(null);
</script>

<template>
  <Combobox v-model="value" by="ID">
    <ComboboxAnchor class="w-full h-fit" as-child>
      <ComboboxTrigger as-child>
        <BaseButton
          variant="outline"
          class="justify-between font-normal text-left rounded-md"
        >
          <BaseAvatar
            v-if="value"
            :text="`${value.FirstName[0]}${value.LastName[0]}`"
            :title="`${value.FirstName} ${value.LastName}`"
            :description="value.Email"
            :img="value.ImgUrl"
          />
          <p v-else>เพิ่มลูกค้า</p>
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </BaseButton>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList class="p-1 w-[var(--reka-popper-anchor-width)]">
      <div class="relative w-full max-w-sm items-center">
        <ComboboxInput
          class="focus-visible:ring-0 rounded-none h-10 w-[var(--reka-popper-anchor-width)]"
          placeholder="ค้นหาลูกค้า..."
        />
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
        >
          <Search class="size-4 text-muted-foreground" />
        </span>
      </div>

      <ComboboxEmpty> ไม่มีข้อมูลลูกค้า </ComboboxEmpty>

      <ComboboxGroup>
        <ComboboxItem
          v-for="customer in customers"
          :key="customer.ID"
          :value="customer"
          class="cursor-pointer"
        >
          <BaseAvatar
            :text="`${customer.FirstName[0]}${customer.LastName[0]}`"
            :title="`${customer.FirstName} ${customer.LastName}`"
            :description="customer.Email"
            :img="customer.ImgUrl"
          />
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
