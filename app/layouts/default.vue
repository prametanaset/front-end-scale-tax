<template>
  <!-- 1) ล็อกความสูงทั้งหน้า + ซ่อนสกรอลกรอบนอก -->
  <SidebarProvider v-model:open="open" class="h-dvh overflow-hidden">
    <LayoutAppSidebar />

    <!-- 2) คอลัมน์หลักต้องมี h-full + min-h-0 -->
    <SidebarInset class=" min-h-0 flex-col">
      <AppSidebarHeader>
        <template #title>
          <BaseBreadcrumb />
        </template>
        <template #actions>
          <slot name="header-actions" />
        </template>
      </AppSidebarHeader>

      <!-- 3) ให้ตัวนี้เป็นคนเลื่อน -->
      <div
        aria-label="Page content"
        class="flex-1 min-h-0 overflow-y-auto"
      >
        <!-- ถ้ายังอยากได้ padding/gap เหมือนเดิม ให้ห่ออีกชั้น -->
        <div class="flex flex-col gap-4">
          <slot />
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'
import AppSidebarHeader from '~/components/layout/AppSidebarHeader.vue'

const isStuck = ref(false)
const sentinel = ref<HTMLElement | null>(null)
const open = ref(true)
const isLg = useMediaQuery('(min-width: 1457px)')

onMounted(() => {
  const observer = new IntersectionObserver(
    ([e]) => {
      if (e) isStuck.value = !e.isIntersecting
    },
    { threshold: [1] },
  )
  if (sentinel.value) observer.observe(sentinel.value)

  open.value = isLg.value
  watch(isLg, (val) => { open.value = val })
})
</script>