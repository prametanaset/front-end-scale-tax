<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
    <SidebarTrigger class="-ml-1 cursor-pointer" />
    <!-- Left: Title and Breadcrumb -->
    <div class="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
      <slot name="title">
        <BaseBreadcrumb />
      </slot>
    </div>

    <!-- Right: Actions or Filters -->
    <div class="flex items-center gap-2">
      <ToolsSwitcher />
    </div>
  </header>
</template>


<script lang="ts" setup>
import ToolsSwitcher from '@/components/layout/tools/ToolsSwitcher.vue'

</script>

<style>

</style>