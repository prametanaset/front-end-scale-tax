<template>
  <header class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
    <SidebarTrigger class="-ml-1 cursor-pointer" v-if="isGreaterThanBreakpoint" />
    <!-- Left: Title and Breadcrumb -->
    <div class="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
      <slot name="title">
        <BaseBreadcrumb />
      </slot>
    </div>

    <!-- Right: Actions or Filters -->
    <div class="flex items-center gap-2 min-w-[50%]">
      <ToolsSwitcher />
    </div>
  </header>
</template>

<script lang="ts" setup>
import ToolsSwitcher from "@/components/layout/tools/ToolsSwitcher.vue";
const bp = useBreakpointStore()
const { md, isGreaterThanBreakpoint } = storeToRefs(bp)
bp.setCompareBreakpoint('md')

</script>

<style></style>
