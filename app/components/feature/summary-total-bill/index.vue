<template>
  <Card :class="cn('w-[380px]', $attrs.class ?? '')">
    <div class="flex flex-col gap-y-0 p-6">
      <h3 class="text-xl font-semibold leading-tight tracking-tight">จำนวนเงินในใบแจ้งหนี้</h3>
      <p class="text-sm font-normal leading-snug text-muted-600 dark:text-white">แสดงเป็นบาท (THB)</p>
    </div>

    <CardContent class="grid gap-4">
      <!-- Total Display -->
      <div class="border-b border-muted-200 pb-4 dark:border-muted-800/80">
        <div class="mb-3 text-2xl font-bold leading-none tracking-normal font-heading">
          ฿{{ total.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
          <span class="inline text-sm font-normal leading-normal tracking-normal text-muted-600 dark:text-white">
            (รวมภาษีมูลค่าเพิ่ม)
          </span>
        </div>

        <!-- Discount Popover -->
        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="secondary"
              size="sm"
              class="w-fit truncate rounded-xl bg-primary/15 text-center text-sm font-semibold text-primary-600 dark:text-primary-light cursor-pointer"
            >
              <CirclePlus class="mr-1" />
              เพิ่มส่วนลด
            </Button>
          </PopoverTrigger>

          <PopoverContent class="w-80" align="start">
            <div class="grid gap-4">
              <div class="space-y-2">
                <h4 class="font-bold leading-none">เพิ่มส่วนลด</h4>
                <p class="text-sm font-medium text-muted-foreground">
                  กรุณาเลือกประเภทและมูลค่าของส่วนลด
                </p>
              </div>

              <div class="grid gap-2">
                <div class="grid grid-cols-3 items-center gap-4">
                  <label class="font-semibold">ประเภท</label>
                  <Select v-model="discountType">
                    <SelectTrigger class="col-span-2 h-8 font-normal">
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="%">เปอร์เซ็นต์ (%)</SelectItem>
                      <SelectItem value="฿">บาท (฿)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="grid grid-cols-3 items-center gap-4">
                  <label class="font-semibold">มูลค่า</label>
                  <Input
                    v-model.number="discountValue"
                    type="number"
                    min="0"
                    class="col-span-2 h-8 text-center"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <!-- Breakdown -->
      <div class="border-b border-muted-200 pb-4 dark:border-muted-800/80">
        <div class="flex justify-between">
          <p class="text-base font-normal">ยอดก่อนภาษี</p>
          <p>฿{{ beforeTaxAmount.toFixed(2) }}</p>
        </div>
        <div class="flex justify-between">
          <p class="text-base font-normal">ส่วนลด</p>
          <p>฿{{ discountAmount.toFixed(2) }}</p>
        </div>
        <div class="flex justify-between">
          <p class="text-base font-normal">ภาษี (7%)</p>
          <p>฿{{ tax.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Final Total -->
      <div class="flex justify-between text-xl">
        <p class="text-lg font-suk">รวมทั้งหมด</p>
        <p class="font-bold">฿{{ total.toFixed(2) }}</p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { CirclePlus } from 'lucide-vue-next'

// Constants
const beforeTaxAmount = 8000

// Reactive states
const discountType = ref<'%' | '฿' | ''>('')
const discountValue = ref<number>(0)

// Computed discount amount
const discountAmount = computed(() => {
  if (discountType.value === '%') {
    return (beforeTaxAmount * discountValue.value) / 100
  }
  if (discountType.value === '฿') {
    return Math.min(discountValue.value, beforeTaxAmount)
  }
  return 0
})

// Tax & total calculation
const tax = computed(() => (beforeTaxAmount - discountAmount.value) * 0.07)
const total = computed(() => (beforeTaxAmount - discountAmount.value) + tax.value)
</script>
