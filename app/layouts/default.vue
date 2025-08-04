<template>
  <SidebarProvider>
    <LayoutAppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <BaseBreadcrumb />
        </div>
      </header>
      <main>
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script lang="ts" setup>

</script>

<style>

</style>