<template>
  <!-- 2 columns on md+, single column on mobile -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
    <!-- LEFT COLUMN: ลูกค้า + เลขที่ + วันที่ -->
    <div class="space-y-5 min-w-0">
      
      <!-- เลขที่ -->
      <div class="space-y-1.5">
        <Label for="invoice-number" class="text-sm font-medium">เลขที่</Label>
        <Input
          id="invoice-number"
          v-model.trim="invoiceNo"
          type="text"
          placeholder="เช่น INV-2025-0001"
          class="h-10 w-full placeholder:font-normal"
          autocomplete="off"
          @blur="normalizeInvoiceNo"
          :aria-invalid="!!invoiceNo && !isInvoiceNoValid"
          :aria-errormessage="!isInvoiceNoValid ? 'invoice-help' : undefined"
        />
        <div class="flex items-start justify-between">
          <p id="invoice-help" class="text-xs text-muted-foreground">
            กำหนดรูปแบบให้ค้นหาง่าย เช่น INV-ปี-เลขรันนิ่ง
          </p>
          <p v-if="!!invoiceNo && !isInvoiceNoValid" class="text-xs text-destructive">
            รูปแบบไม่ถูกต้อง
          </p>
        </div>
      </div>

      <!-- วันที่ -->
      <div class="space-y-1.5">
        <Label for="invoice-date" class="text-sm font-medium">วันที่</Label>
        <BaseDatePicker id="invoice-date" class="h-10 w-full" />
        <p class="text-xs text-muted-foreground">วันที่ออกใบแจ้งหนี้</p>
      </div>

      <div class="space-y-1.5">
        <Label class="text-sm font-medium">Ref.</Label>

        <!-- ว่าง -->
        <div v-if="!selected" class="space-y-1">
          <Popover v-model:open="popoverOpen">
            <PopoverTrigger as-child>
              <BaseButton variant="outline" class="h-9 px-3 gap-2">
                <Plus class="h-4 w-4" /> เพิ่มอ้างอิง
              </BaseButton>
            </PopoverTrigger>

            <PopoverContent class="w-72 p-3 rounded-xl" align="start" :side-offset="8">
              <form @submit.prevent="onAdd" class="flex flex-col gap-2">
                <Input
                  v-model.trim="inputValue"
                  placeholder="เช่น PO-12345 หรือ JOB-6789"
                  class="h-9 w-full"
                  autocomplete="off"
                  autofocus
                  @keydown.enter.prevent="onAdd"
                />
                <div class="flex items-center gap-2">
                  <BaseButton type="submit" :disabled="!inputValue" class="flex-1 h-9 rounded-lg">
                    เพิ่ม
                  </BaseButton>
                  <BaseButton type="button" variant="ghost" class="h-9" @click="clearInput">
                    ล้าง
                  </BaseButton>
                </div>
              </form>
            </PopoverContent>
          </Popover>

          <p class="text-xs text-muted-foreground">
            เช่น เลขที่ใบสั่งซื้อ (PO) หรือรหัสงาน (Job)
          </p>
        </div>

        <!-- มีค่า -->
        <div v-else class="space-y-1">
          <Badge variant="secondary" class="inline-flex items-center gap-2 rounded-full px-3 py-1">
            <span class="truncate max-w-[240px]">{{ selected }}</span>
            <BaseButton
              variant="ghost" size="icon" aria-label="แก้ไข"
              class="h-6 w-6" @click="editSelected" title="แก้ไข"
            >✎</BaseButton>
            <BaseButton
              variant="ghost" size="icon" aria-label="ลบ"
              class="h-6 w-6" @click="onRemove" title="ลบ"
            >
              <X class="w-4 h-4" />
            </BaseButton>
          </Badge>
          <p class="text-xs text-muted-foreground">อ้างอิงภายนอก เช่น PO/DO/Job</p>
        </div>
      </div>
      
    </div>

    <!-- RIGHT COLUMN: Ref. -->
    <div class="space-y-5">
      <!-- ลูกค้า -->
      <div class="space-y-1.5 min-w-0">
        <Label for="customer" class="text-sm font-medium">ลูกค้า</Label>
        <FeatureInvoiceAddCustomer id="customer" class="w-full" />
        <p class="text-xs text-muted-foreground">เลือกลูกค้าหรือเพิ่มใหม่</p>
      </div>
      
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from "vue"
import { Plus, X } from "lucide-vue-next"

const invoiceNo = ref("")
const popoverOpen = ref(false)
const inputValue = ref("")
const selected = ref<string | null>(null)

/** simple, adjustable invoice pattern; keep soft validation */
const isInvoiceNoValid = computed(() => {
  if (!invoiceNo.value) return true
  return /^[A-Z0-9-]{4,}$/.test(invoiceNo.value) // e.g., INV-2025-0001
})

function normalizeInvoiceNo() {
  if (!invoiceNo.value) return
  invoiceNo.value = invoiceNo.value.replace(/\s+/g, "-").toUpperCase()
}

function onAdd() {
  if (!inputValue.value) return
  selected.value = inputValue.value
  inputValue.value = ""
  popoverOpen.value = false
}

function clearInput() {
  inputValue.value = ""
}

function onRemove() {
  selected.value = null
  inputValue.value = ""
}

function editSelected() {
  inputValue.value = selected.value ?? ""
  popoverOpen.value = true
}
</script>
