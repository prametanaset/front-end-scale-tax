<template>
  <div class="flex flex-1 flex-col p-4 gap-4 h-[calc(100vh-theme(spacing.20))]">

    <!-- Row 1: KPIs -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="kpi in kpis" :key="kpi.label" class="rounded-xl border bg-card p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">{{ kpi.label }}</p>
          <component :is="kpi.icon" class="h-4 w-4 opacity-60" />
        </div>
        <div class="mt-2 flex items-baseline gap-2">
          <p class="text-2xl font-bold tabular-nums">{{ kpi.value }}</p>
          <span :class="kpi.delta >= 0 ? 'text-emerald-600' : 'text-red-600'" class="text-xs font-medium">
            {{ kpi.delta >= 0 ? '+' : '' }}{{ kpi.delta }}%
          </span>
        </div>
        <p class="mt-1 text-xs text-muted-foreground">{{ kpi.subtext }}</p>
      </div>
    </div>

    <!-- Row 2: Charts -->
    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Line -->
      <div class="rounded-xl border bg-card">
        <div class="flex items-center justify-between p-4">
          <h3 class="text-sm font-medium">ยอดขาย (14 วัน)</h3>
          <span class="text-xs text-muted-foreground">หน่วย: รายการ</span>
        </div>
        <div class="px-4 pb-4">
          <!-- <ChartLine :series="salesSeries" theme="primary" aspect="aspect-[3/1]" height="h-48" width="w-full" /> -->
          <BarChart
            index="name"
            :data="data"
            :categories="['total', 'predicted']"
            :y-formatter="
              (tick, i) => {
                return typeof tick === 'number'
                  ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                  : '';
              }
            "
            :type="'stacked'"
            :rounded-corners="4"
            class="h-48 w-full"
          />
        </div>
      </div>

      <!-- Column -->
      <div class="rounded-xl border bg-card">
        <div class="flex items-center justify-between p-4">
          <h3 class="text-sm font-medium">คำขอใช้งาน / โทเคน</h3>
          <span class="text-xs text-muted-foreground">ช่วงไฮไลต์ {{ highlightLabel }}</span>
        </div>
        <div class="px-4 pb-4">
          <BarChart
            index="name"
            :data="data"
            :categories="['total', 'predicted']"
            :y-formatter="
              (tick, i) => {
                return typeof tick === 'number'
                  ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                  : '';
              }
            "
            :type="'stacked'"
            :rounded-corners="4"
            class="h-48 w-full"
          />
        </div>
      </div>

      <!-- Quick actions card -->
      <div class="rounded-xl border bg-card flex flex-col">
        <div class="flex items-center justify-between p-4">
          <h3 class="text-sm font-medium">การทำงานด่วน</h3>
        </div>
        <div class="px-4 pb-4">
          <feature-dashboard-quick-action />
        </div>
      </div>
    </div>

    <!-- Row 3: Table + Notes -->
    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Recent invoices table -->
      <div class="lg:col-span-2 rounded-xl border bg-card overflow-hidden">
        <div class="flex items-center justify-between p-4">
          <h3 class="text-sm font-medium">รายการใบแจ้งหนี้ล่าสุด</h3>
          <BaseButton variant="outline" size="sm">ดูทั้งหมด</BaseButton>
        </div>

        <div class="overflow-x-auto">
          <div class="min-w-[760px]">
            <!-- sticky header scroll body -->
            <Table class="table-fixed">
              <colgroup>
                <col style="width:18%" />
                <col style="width:26%" />
                <col style="width:16%" />
                <col style="width:16%" />
                <col style="width:12%" />
                <col style="width:12%" />
              </colgroup>
              <TableHeader class="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead>เลขที่</TableHead>
                  <TableHead>ลูกค้า</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่</TableHead>
                  <TableHead class="text-right">ยอดรวม</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
            </Table>

            <div class="max-h-[360px] overflow-y-auto">
              <Table class="table-fixed">
                <colgroup>
                  <col style="width:18%" />
                  <col style="width:26%" />
                  <col style="width:16%" />
                  <col style="width:16%" />
                  <col style="width:12%" />
                  <col style="width:12%" />
                </colgroup>
                <TableBody>
                  <TableRow v-for="inv in invoices" :key="inv.id" class="group">
                    <TableCell class="font-medium">{{ inv.no }}</TableCell>
                    <TableCell class="truncate">
                      <div class="flex items-center gap-2">
                        <img :src="inv.avatar" class="h-6 w-6 rounded-full object-cover" alt="customer-img" />
                        <span class="truncate">{{ inv.customer }}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge :variant="statusVariant(inv.status)">{{ inv.status }}</Badge>
                    </TableCell>
                    <TableCell class="text-sm text-muted-foreground">
                      {{ formatDate(inv.date) }}
                    </TableCell>
                    <TableCell class="text-right tabular-nums">{{ currency(inv.total) }}</TableCell>
                    <TableCell class="text-right">
                      <BaseButton variant="ghost" size="icon" class="opacity-0 group-hover:opacity-100 transition-opacity">
                        ⋯
                      </BaseButton>
                    </TableCell>
                  </TableRow>

                  <TableRow v-if="!invoices.length">
                    <TableCell colspan="6" class="text-center text-sm text-muted-foreground py-10">
                      ไม่พบรายการ
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes / scratch pad -->
      <div class="rounded-xl border bg-card flex flex-col">
        <div class="flex items-center justify-between p-4">
          <Label for="note" class="text-sm font-medium">หมายเหตุ</Label>
        </div>
        <div class="px-4 pb-4">
          <Textarea
            id="note"
            class="w-full h-full"
            placeholder="จดโน้ตสั้น ๆ ที่นี่…"
          ></Textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp, DollarSign, Receipt, Users } from "lucide-vue-next"
import Label from "~/components/ui/label/Label.vue"

definePageMeta({
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "แผงควบคุม" },
  ],
})

/* ===== KPIs ===== */
const kpis = [
  { label: "ยอดขายวันนี้", value: "฿25,400", delta: 8.4, subtext: "เทียบเมื่อวาน", icon: DollarSign },
  { label: "ใบแจ้งหนี้ใหม่", value: "32", delta: 3.1, subtext: "24 ชม.ล่าสุด", icon: Receipt },
  { label: "ลูกค้าใหม่", value: "12", delta: 1.8, subtext: "สัปดาห์นี้", icon: Users },
  { label: "อัตราเติบโต", value: "12.7%", delta: 0.9, subtext: "เทียบเดือนก่อน", icon: TrendingUp },
]

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 2000) + 500,
    predicted: Math.floor(Math.random() * 2000) + 500,
  },
];
const start = Date.UTC(2025, 6, 25)
const days = Array.from({ length: 16 }, (_, i) => start + i * 24 * 3600 * 1000)


const highlightFrom = Date.UTC(2025, 6, 27, 0)
const highlightTo = Date.UTC(2025, 6, 29, 0)
const highlightLabel = computed(() => {
  const toDate = (t: number) => new Date(t).toLocaleDateString("th-TH", { day: "2-digit", month: "short" })
  return `${toDate(highlightFrom)} – ${toDate(highlightTo)}`
})

/* ===== Table data ===== */
type Invoice = {
  id: number
  no: string
  customer: string
  avatar: string
  status: "Paid" | "Pending" | "Unpaid"
  date: string // ISO
  total: number
}

const invoices: Invoice[] = [
  { id: 1, no: "INV-2025-0008", customer: "Muji Co., Ltd.", avatar: "https://i.pravatar.cc/48?img=11", status: "Paid",   date: "2025-08-18", total: 8560 },
  { id: 2, no: "INV-2025-0007", customer: "Acme Corp",       avatar: "https://i.pravatar.cc/48?img=12", status: "Pending",date: "2025-08-17", total: 3200 },
  { id: 3, no: "INV-2025-0006", customer: "Globex",          avatar: "https://i.pravatar.cc/48?img=13", status: "Unpaid", date: "2025-08-16", total: 12750 },
  { id: 4, no: "INV-2025-0005", customer: "Soylent LLC",     avatar: "https://i.pravatar.cc/48?img=14", status: "Paid",   date: "2025-08-15", total: 4900 },
]

function statusVariant(s: Invoice["status"]) {
  if (s === "Paid") return "secondary"
  if (s === "Pending") return "default"
  return "destructive"
}

/* helpers */
function currency(n: number) {
  return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 2 }).format(n)
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "2-digit" })
}
</script>

<style scoped>
.tabular-nums { font-variant-numeric: tabular-nums; }
</style>
