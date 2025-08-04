<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="#">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <!-- <Command class="size-4" /> -->
                <Avatar class="h-8 w-8 rounded-lg">
                  <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpX7YaLKKJiyF4MHkNB3FnOJaIYx3jC5YYQw&s" alt="logo" />
                  <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
                </Avatar>
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Muji</span>
                <span class="truncate text-xs">สำนักงานใหญ่</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarGroupContent>
          <NavSecondary :items="data.navMain" />
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup class="mt-auto">
        <SidebarGroupContent>
          <NavSecondary :items="data.navSecondary" />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>

<script lang="ts" setup>
import { Megaphone, PieChart, Home, Users, ShoppingBag, Send, LifeBuoy, FlaskConical } from 'lucide-vue-next';
import type { SidebarProps } from '@/components/ui/sidebar';
import type NavCollapsible from '../nav/NavCollapsible.vue';

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'inset',
  collapsible: 'icon'
})

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://i.pravatar.cc/150',
  },
  navMain: [
    {
      title: 'หน้าแรก',
      url: '/',
      icon: Home,
    },
    {
      title: 'รายการใบแจ่้งหนี้',
      url: '/invoices',
      icon: PieChart,
    },
    {
      title: 'แคตตาล็อกสินค้า',
      url: '/catalogs',
      icon: ShoppingBag,
    },
    {
      title: 'ลูกค้า',
      url: '/customers',
      icon: Users,
    },
    {
      title: 'อีเมล',
      url: '/mail',
      icon: Send,
    },
    {
      title: 'ทดสอบ',
      url: '/test',
      icon: FlaskConical,
    },
  ],

  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Megaphone,
    },
  ],
}
</script>

<style></style>
