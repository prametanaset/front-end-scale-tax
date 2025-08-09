<template>
  <ClientOnly>
    <div :class="[aspect, height, width]">
      <VueApexCharts
        type="area"
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
import { useTailwindColor, type ThemeKey } from '@/composables/useTailwindColor'

const props = withDefaults(defineProps<{
  series: { name: string; data: number[] }[]
  theme?: ThemeKey
  aspect?: string
  height?: string
  width?: string
}>(), {
  theme: 'warning',
  aspect: 'aspect-video',
  height: 'h-auto',
  width: 'w-full'
})

const chartColor = ref('#facc15')

onMounted(() => {
  chartColor.value = useTailwindColor(props.theme)
})

const computedOptions = computed(() => ({
  chart: {
    type: 'area',
    fontFamily: 'inherit',
    sparkline: { enabled: true },
    toolbar: { show: false },
    animations: { enabled: true }
  },
  dataLabels: { enabled: false },
  colors: [chartColor.value],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.1,
      opacityTo: 0,
      stops: [0, 100],
      colorStops: [
        {
          offset: 0,
          color: chartColor.value,
          opacity: 0.1
        },
        {
          offset: 100,
          color: chartColor.value,
          opacity: 0
        }
      ]
    }
  },
  stroke: {
    curve: 'smooth',
    width: 1
  },
  tooltip: {
    fixed: { enabled: false },
    x: { show: false },
    y: {
      title: {
        formatter: () => 'Sales :'
      }
    }
  }
}))
</script>
