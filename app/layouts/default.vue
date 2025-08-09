<template>
  <SidebarProvider v-model:open="open">
    <LayoutAppSidebar />
    <SidebarInset>
      <AppSidebarHeader>
        <template #title>
          <BaseBreadcrumb />
        </template>
        <template #actions>
          <slot name="header-actions" />
        </template>
      </AppSidebarHeader>
      <section aria-label="Page content" class="scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-red-500 scrollbar-track-red-200">
        <slot />
      </section>
    </SidebarInset>
  </SidebarProvider>
</template>

<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core';
import AppSidebarHeader from '~/components/layout/AppSidebarHeader.vue';

const isStuck = ref(false);
const sentinel = ref<HTMLElement | null>(null);
const open = ref(true);
const isLg = useMediaQuery("(min-width: 1457px)");

onMounted(() => {
  const observer = new IntersectionObserver(
    ([e]) => {
      if (e) {
        isStuck.value = !e.isIntersecting;
      }
    },
    { threshold: [1] }
  );
  if (sentinel.value) {
    observer.observe(sentinel.value);
  }

  // ตั้งค่าครั้งแรกตามขนาดจริงบน client
  open.value = isLg.value;

  // ฟังการเปลี่ยนแปลงครั้งต่อ ๆ ไป
  watch(isLg, (val) => {
    open.value = val;
  });
});
</script>

<style>

</style>