<template>
  <SidebarMenu>
    <SidebarMenuItem v-for="item in items" :key="item.title">
      <SidebarMenuButton as-child :size="null" :is-active="item.url === $route.path" >
        <NuxtLink :to="item.url">
          <component :is="item.icon" class="size-4" />
          <span>{{ item.title }}</span>
        </NuxtLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<script lang="ts" setup>
import type { LucideIcon } from "lucide-vue-next"

const props = defineProps<{
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
}>()
</script>
