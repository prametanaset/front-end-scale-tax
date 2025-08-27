<template>
  <SidebarProvider v-model:open="open" class="h-dvh overflow-hidden">
    <LayoutAppSidebar />

    <SidebarInset class="min-h-0 flex-col">
      <AppSidebarHeader />

      <div class="flex-1 min-h-0 overflow-y-auto">
        <div class="flex flex-col gap-4">
          <slot />
        </div>
      </div>

      <FeaturePwaInstall
        title="ติดตั้ง e-Tax by Timestamp"
        text="เพิ่มลงโฮมสกรีน ใช้งานสะดวกและรวดเร็วขึ้น"
        confirmButton="ติดตั้งเลย"
        cancelButton="ภายหลัง"
      />
    </SidebarInset>

    <LayoutMobileNav v-if="!isGreaterThanBreakpoint"/>
  </SidebarProvider>
</template>

<script lang="ts" setup>
import { useMediaQuery } from "@vueuse/core";
import AppSidebarHeader from "~/components/layout/AppSidebarHeader.vue";

const bp = useBreakpointStore()
const { isGreaterThanBreakpoint } = storeToRefs(bp)
bp.setCompareBreakpoint('sm')

const isStuck = ref(false);
const sentinel = ref<HTMLElement | null>(null);
const open = ref(true);
const isLg = useMediaQuery("(min-width: 1457px)");

onMounted(() => {
  const observer = new IntersectionObserver(
    ([e]) => {
      if (e) isStuck.value = !e.isIntersecting;
    },
    { threshold: [1] }
  );
  if (sentinel.value) observer.observe(sentinel.value);

  open.value = isLg.value;
  watch(isLg, (val) => {
    open.value = val;
  });
});
</script>
