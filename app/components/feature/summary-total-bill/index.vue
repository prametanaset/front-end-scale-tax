<template>
  <BaseCard class="w-full">
    <CardHeader class="gap-y-1">
      <h3 class="text-xl font-semibold leading-tight tracking-tight">จำนวนเงินในใบแจ้งหนี้</h3>
      <p class="text-sm text-muted-foreground">แสดงเป็นบาท (THB)</p>
    </CardHeader>

    <CardContent class="grid gap-5">
      <!-- TOP: Grand total + discount badge/actions -->
      <div class="border-b pb-4">
        <div class="mb-2 flex items-baseline gap-2">
          <div class="text-3xl font-bold tabular-nums">
            {{ currency(total) }}
          </div>
          <span class="text-sm text-muted-foreground">(รวมภาษีมูลค่าเพิ่ม {{ (vatRate*100).toFixed(0) }}%)</span>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <template v-if="hasDiscount">
            <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-[hsl(var(--muted))]">
              ส่วนลด:
              <strong class="tabular-nums">
                {{ discountType === '%' ? `-${effectiveDiscountValue}%` : `-${currency(effectiveDiscountValue)}` }}
              </strong>
            </span>
            <BaseButton variant="outline" size="sm" class="gap-2" @click="openDialog()">
              แก้ไขส่วนลด
            </BaseButton>
            <BaseButton variant="ghost" size="sm" class="text-destructive" @click="clearDiscount">
              ลบส่วนลด
            </BaseButton>
          </template>

          <template v-else>
            <BaseButton variant="secondary" size="sm" class="gap-2" @click="openDialog('%')">
              <CirclePlus class="w-4 h-4" />
              เพิ่มส่วนลด
            </BaseButton>
          </template>
        </div>

        <!-- Live region สำหรับผู้อ่านหน้าจอ -->
        <p class="sr-only" aria-live="polite">ยอดรวมปัจจุบัน {{ currency(total) }} บาท</p>
      </div>

      <!-- BREAKDOWN -->
      <div class="space-y-2 border-b pb-4">
        <div class="flex items-center justify-between">
          <p class="text-base text-muted-foreground">ส่วนลด</p>
          <p class="tabular-nums">-{{ currency(discountAmount) }}</p>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-base text-muted-foreground">ยอดก่อนภาษี</p>
          <p class="tabular-nums">{{ currency(beforeTaxAmount) }}</p>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-base text-muted-foreground">ภาษีมูลค่าเพิ่ม ({{ (vatRate*100).toFixed(0) }}%)</p>
          <p class="tabular-nums">{{ currency(tax) }}</p>
        </div>
      </div>
    </CardContent>

    <CardFooter class="flex items-center justify-between">
      <p class="text-lg">ยอดสุทธิ</p>
      <p class="text-2xl font-bold tabular-nums">{{ currency(total) }}</p>
    </CardFooter>

    <!-- DIALOG: Add/Edit discount -->
    <Dialog v-model:open="dialogOpen">
  <DialogContent class="sm:max-w-[440px]">
    <DialogHeader>
      <DialogTitle>ตั้งค่าส่วนลด</DialogTitle>
      <DialogDescription id="discount-help">
        เลือกประเภทและระบุมูลค่าส่วนลด
      </DialogDescription>
    </DialogHeader>

    <form @submit.prevent="saveDiscount" novalidate>
      <div class="grid gap-4">
        <!-- ประเภท -->
        <div class="grid grid-cols-3 items-center gap-3">
          <Label for="discount-type">ประเภท</Label>
          <!-- ใช้ col-span-2 กับตัว control (Trigger) ให้เต็มแถว -->
          <div class="col-span-2">
            <Select v-model="draftType">
              <SelectTrigger id="discount-type" class="h-9 w-full" aria-describedby="discount-help">
                <SelectValue placeholder="เลือกประเภท" />
              </SelectTrigger>
              <!-- ใช้ popper เพื่อไม่ชน stacking ของ Dialog -->
              <SelectContent position="popper" :side-offset="6">
                <SelectItem value="%">เปอร์เซ็นต์ (%)</SelectItem>
                <SelectItem value="฿">บาท (฿)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- มูลค่า -->
        <div class="grid grid-cols-3 items-center gap-3">
          <Label for="discount-value">มูลค่า</Label>
          <div class="col-span-2">
            <Input
              id="discount-value"
              v-model.number="draftValue"
              type="number"
              inputmode="decimal"
              :min="0"
              :max="draftType === '%' ? 100 : beforeTaxAmount"
              :step="draftType === '%' ? '0.01' : '0.01'"
              class="h-9 text-right tabular-nums"
              placeholder="0"
              autofocus
              @wheel.prevent
              @blur="() => {
                const min = 0
                const max = draftType === '%' ? 100 : beforeTaxAmount
                if (draftValue === undefined || draftValue === null || Number.isNaN(draftValue)) draftValue = 0
                draftValue = Math.min(max, Math.max(min, Number(draftValue)))
              }"
            />
            <p class="mt-1 text-xs text-muted-foreground" v-if="draftType === '%'">
              กำหนดได้ 0–100%
            </p>
            <p class="mt-1 text-xs text-muted-foreground" v-else>
              สูงสุด {{ currency(beforeTaxAmount) }} บาท
            </p>
            <p class="mt-1 text-xs text-destructive" v-if="errorMsg">{{ errorMsg }}</p>
          </div>
        </div>
      </div>

      <DialogFooter class="mt-4">
        <DialogClose as-child>
          <BaseButton type="button" variant="outline">ยกเลิก</BaseButton>
        </DialogClose>
        <BaseButton type="submit">บันทึกส่วนลด</BaseButton>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

  </BaseCard>
</template>

<script setup lang="ts">
import { CirclePlus } from 'lucide-vue-next'

/** ปรับได้จากภายนอกถ้าต้องการ */
const props = withDefaults(defineProps<{
  beforeTaxAmount?: number,
  vatRate?: number
}>(), {
  beforeTaxAmount: 8000,
  vatRate: 0.07
})

/** state ส่วนลดจริงที่ใช้คำนวณ */
const discountType = ref<'%' | '฿' | ''>('')
const discountValue = ref<number>(0)

/** dialog draft (เพื่อแก้ไขแบบไม่กระทบค่าจริง) */
const dialogOpen = ref(false)
const draftType = ref<'%' | '฿'>('%')
const draftValue = ref<number>(0)
const errorMsg = ref('')

function openDialog(defaultType?: '%' | '฿') {
  draftType.value = (discountType.value || defaultType || '%') as '%' | '฿'
  draftValue.value = discountValue.value || 0
  errorMsg.value = ''
  dialogOpen.value = true
}

function saveDiscount() {
  const t = draftType.value
  let v = Number(draftValue.value) || 0

  if (t === '%') {
    if (v < 0 || v > 100) {
      errorMsg.value = 'เปอร์เซ็นต์ต้องอยู่ระหว่าง 0–100'
      return
    }
  } else {
    if (v < 0) {
      errorMsg.value = 'มูลค่าส่วนลดต้องไม่ติดลบ'
      return
    }
    if (v > props.beforeTaxAmount) {
      errorMsg.value = 'มูลค่าส่วนลดต้องไม่เกินยอดก่อนภาษี'
      return
    }
  }

  discountType.value = t
  discountValue.value = v
  dialogOpen.value = false
}

function clearDiscount() {
  discountType.value = ''
  discountValue.value = 0
}

/** helper แปลงสกุลเงิน */
function currency(n: number) {
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, n))
}

/** ส่วนลดที่ผ่านการ clamp แล้ว (ใช้แสดง badge) */
const effectiveDiscountValue = computed(() => {
  if (discountType.value === '%') return Math.min(100, Math.max(0, discountValue.value))
  if (discountType.value === '฿') return Math.min(props.beforeTaxAmount, Math.max(0, discountValue.value))
  return 0
})

/** ยอดส่วนลดเป็น "บาท" ที่ใช้คำนวณจริง */
const discountAmount = computed(() => {
  if (discountType.value === '%') {
    return (props.beforeTaxAmount * effectiveDiscountValue.value) / 100
  }
  if (discountType.value === '฿') {
    return effectiveDiscountValue.value
  }
  return 0
})

/** ฐานภาษี, ภาษี, และยอดรวม */
const taxBase = computed(() => Math.max(0, props.beforeTaxAmount - discountAmount.value))
const tax = computed(() => taxBase.value * props.vatRate)
const total = computed(() => taxBase.value + tax.value)

/** flag มีส่วนลดไหม */
const hasDiscount = computed(() => discountType.value !== '' && discountAmount.value > 0)

/** expose สำหรับ template */
const beforeTaxAmount = props.beforeTaxAmount
const vatRate = props.vatRate
</script>

<style scoped>
.tabular-nums { font-variant-numeric: tabular-nums; }
</style>
