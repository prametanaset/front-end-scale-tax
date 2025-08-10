<template>
  <div class="space-y-2">
    <!-- PICKER (hidden after selection) -->
    <div v-if="!value || showPicker" class="space-y-2">
      <Combobox v-model="value" by="ID" @update:modelValue="onPicked">
        <ComboboxAnchor as-child class="w-full">
          <ComboboxTrigger as-child>
            <BaseButton variant="outline" class="w-full h-10 justify-between font-normal rounded-md">
              <div class="flex min-w-0 items-center gap-2">
                <span class="text-muted-foreground">เลือกหรือลูกค้าใหม่…</span>
              </div>
              <ChevronsUpDown class="h-4 w-4 opacity-50" />
            </BaseButton>
          </ComboboxTrigger>
        </ComboboxAnchor>

        <ComboboxList class="p-1 w-[var(--reka-popper-anchor-width)]">
          <div class="relative w-full items-center">
            <ComboboxInput
              ref="pickerInputRef"
              v-model="search"
              class="h-10 w-[var(--reka-popper-anchor-width)] rounded-none pl-9 focus-visible:ring-0"
              placeholder="ค้นหาลูกค้า…"
            />
            <span class="absolute inset-y-0 start-0 flex items-center px-3">
              <Search class="size-4 text-muted-foreground" />
            </span>
          </div>

          <ComboboxEmpty v-if="!filtered.length">
            <div class="p-2 text-center text-sm text-muted-foreground">ไม่มีข้อมูลลูกค้า</div>
          </ComboboxEmpty>

          <ComboboxGroup>
            <ComboboxItem
              :value="ADD_NEW_VALUE"
              class="cursor-pointer sticky -top-1 z-10 mb-1 flex items-center gap-2 rounded-md bg-background px-3 py-2 text-primary"
              @click.stop="onAddNew"
            >
              <Plus class="h-4 w-4" />
              <span>เพิ่มลูกค้าใหม่</span>
            </ComboboxItem>

            <ComboboxItem
              v-for="customer in filtered"
              :key="customer.ID"
              :value="customer"
              class="cursor-pointer"
            >
              <BaseAvatar
                :text="initials(customer)"
                :title="fullName(customer)"
                :description="customer.Email"
                :img="customer.ImgUrl"
              />
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxList>
      </Combobox>
    </div>

    <!-- CUSTOMER CARD (shown after selection) -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="value && !showPicker"
        class="rounded-lg border bg-[hsl(var(--card))] p-3 sm:p-4"
      >
        <!-- header -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3 min-w-0">
            <img
              :src="value.ImgUrl"
              alt=""
              class="h-10 w-10 rounded-full object-cover"
              v-if="value.ImgUrl"
            />
            <div v-else class="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {{ initials(value) }}
            </div>
            <div class="min-w-0">
              <p class="font-medium truncate">{{ fullName(value) }}</p>
              <p v-if="value.Email" class="text-xs text-muted-foreground truncate flex items-center gap-1">
                <Mail class="h-3.5 w-3.5 opacity-70" /> {{ value.Email }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <BaseButton variant="ghost" size="sm" class="h-8" @click="emit('view-customer', value.ID)">
              <Pencil class="h-4 w-4 mr-1" /> ดู/แก้ไข
            </BaseButton>
            <BaseButton variant="outline" size="sm" class="h-8" @click="openPicker">
              <RefreshCw class="h-4 w-4 mr-1" /> เปลี่ยนลูกค้า
            </BaseButton>
          </div>
        </div>

        <!-- body -->
        <div class="mt-3 grid gap-2 text-sm">
          <div v-if="value.Phone" class="flex items-center gap-2">
            <Phone class="h-4 w-4 text-muted-foreground" />
            <span>{{ value.Phone }}</span>
          </div>

          <div v-if="value.TaxId" class="flex items-center gap-2">
            <Hash class="h-4 w-4 text-muted-foreground" />
            <span class="tabular-nums">{{ value.TaxId }}</span>
            <BaseButton variant="ghost" size="icon" class="h-7 w-7" aria-label="คัดลอกเลขผู้เสียภาษี" @click="copy(value.TaxId)">
              <Copy class="h-4 w-4" />
            </BaseButton>
          </div>

          <div v-if="displayAddress" class="flex items-start gap-2">
            <MapPin class="h-4 w-4 text-muted-foreground mt-0.5" />
            <span class="break-words flex-1">{{ displayAddress }}</span>
            <BaseButton variant="ghost" size="icon" class="h-7 w-7 mt-[-2px]" aria-label="คัดลอกที่อยู่" @click="copy(displayAddress)">
              <Copy class="h-4 w-4" />
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue"
import { ChevronsUpDown, Search, Plus, Pencil, RefreshCw, Copy, Phone, Mail, MapPin, Hash } from "lucide-vue-next"

type Customer = {
  ID: number
  StoreId: number
  FirstName: string
  LastName: string
  Email: string
  Phone?: string
  Address?: string
  TaxId?: string
  CreatedAt: string
  UpdatedAt: string
  ImgUrl?: string
}

const ADD_NEW_VALUE = "__ADD_NEW__"

const customers = ref<Customer[]>([
  { ID: 1, StoreId: 101, FirstName: "John", LastName: "Doe", Email: "john.doe@example.com", Phone: "0123456789", Address: "123 Main Street, Bangkok 10110", TaxId: "0105537000000", CreatedAt: "2024-01-01", UpdatedAt: "2024-01-01", ImgUrl: "https://i.pravatar.cc/100?img=1" },
  { ID: 2, StoreId: 102, FirstName: "Jane", LastName: "Smith", Email: "jane.smith@example.com", Address: "456 Second Ave, Chiang Mai 50000", CreatedAt: "2024-02-01", UpdatedAt: "2024-02-01", ImgUrl: "https://i.pravatar.cc/100?img=2" },
])

const value = ref<Customer | null>(null)
const showPicker = ref(false)
const search = ref("")
const pickerInputRef = ref<HTMLInputElement | null>(null)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return customers.value
  return customers.value.filter((c) =>
    `${c.FirstName} ${c.LastName} ${c.Email} ${c.Phone ?? ""} ${c.Address ?? ""}`.toLowerCase().includes(q)
  )
})

const displayAddress = computed(() => value.value?.Address?.trim() || "")

function initials(c: Customer | null) {
  if (!c) return ""
  const f = c.FirstName?.[0] ?? ""
  const l = c.LastName?.[0] ?? ""
  return `${f}${l}` || (c.Email?.[0] ?? "?")
}
function fullName(c: Customer | null) {
  if (!c) return ""
  return [c.FirstName?.trim(), c.LastName?.trim()].filter(Boolean).join(" ")
}

function onPicked(v: unknown) {
  if (v === ADD_NEW_VALUE) return
  if (typeof v === "bigint") return // ignore or handle as needed
  if (v && typeof v === "object") {
    value.value = v as Customer
    showPicker.value = false
  }
}

function openPicker() {
  showPicker.value = true
  nextTick(() => pickerInputRef.value?.focus())
}

function clearSelection() {
  value.value = null
  search.value = ""
  showPicker.value = true
  nextTick(() => pickerInputRef.value?.focus())
}

async function copy(text: string) {
  try { await navigator.clipboard.writeText(text) } catch {}
}

const emit = defineEmits<{
  (e: "add-new"): void
  (e: "view-customer", id: number): void
}>()

function onAddNew() {
  // let parent open dialog / route to create
  emit("add-new")
}
</script>

<style scoped>
.tabular-nums { font-variant-numeric: tabular-nums; }
</style>
