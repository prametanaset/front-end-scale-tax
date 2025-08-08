<template>
  <SidebarProvider>
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
      <main>
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script lang="ts" setup>
import AppSidebarHeader from '~/components/layout/AppSidebarHeader.vue';


</script>

<style>

</style>