<!-- components/ColumnUsageApex.vue -->
<template>
  <ClientOnly>
    <div :class="[aspect, height, width]">
      <VueApexCharts
        type="bar"
        :options="computedOptions"
        :series="series"
        width="100%"
        height="100%"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import { ref, computed, onMounted } from 'vue'
import { useTailwindColor, type ThemeKey } from '@/composables/useTailwindColor'

type XY = { x: number | string; y: number }
type Serie = { name: string; data: XY[] }

const props = withDefaults(defineProps<{
  series: Serie[]
  theme?: ThemeKey
  aspect?: string
  height?: string
  width?: string
  highlightFrom?: number | string
  highlightTo?: number | string
}>(), {
  theme: 'warning',
  aspect: 'aspect-[16/5]',
  height: 'h-auto',
  width: 'w-full'
})

const chartColor = ref('#facc15')

onMounted(() => {
  chartColor.value = useTailwindColor(props.theme) || '#facc15'
})

const computedOptions = computed(() => {
  const allPoints = props.series.flatMap(s => s.data)
  const xs = allPoints.map(p => (typeof p.x === 'string' ? new Date(p.x).getTime() : +p.x))
  const minX = xs.length ? Math.min(...xs) : undefined
  const maxX = xs.length ? Math.max(...xs) : undefined

  return {
    chart: {
      type: 'bar',
      background: 'transparent',
      fontFamily: 'inherit',
      toolbar: { show: false },
      animations: { enabled: true }
    },
    plotOptions: {
      bar: {
        horizontal: false,        // make it columns
        columnWidth: '50%',       // adjust thickness
        borderRadius: 2
      }
    },
    colors: [chartColor.value, '#9ca3af', '#a78bfa', '#60a5fa'],
    dataLabels: { enabled: false },
    xaxis: {
      type: 'datetime',
      min: minX,
      max: maxX,
      tickAmount: 2,              // two ticks: start & end
      labels: {
        datetimeUTC: true,
        style: { colors: 'rgba(255,255,255,0.6)' },
        format: 'MMM dd'
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    grid: { show: false },
    tooltip: {
      theme: 'dark',
      x: { format: 'MMM dd, yyyy UTC' },
      y: {
        formatter: (val: number, { seriesIndex, w }: any) => {
          const name = w.config.series[seriesIndex]?.name ?? ''
          return `${val} ${name}`
        }
      }
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          strokeDashArray: 6,
          borderColor: 'rgba(255,255,255,0.45)'
        }
      ],
      xaxis: props.highlightFrom && props.highlightTo ? [
        {
          x: typeof props.highlightFrom === 'string' ? new Date(props.highlightFrom).getTime() : +props.highlightFrom,
          x2: typeof props.highlightTo === 'string' ? new Date(props.highlightTo).getTime() : +props.highlightTo,
          fillColor: 'rgba(255,255,255,0.10)',
          opacity: 1
        }
      ] : []
    }
  }
})
</script>
