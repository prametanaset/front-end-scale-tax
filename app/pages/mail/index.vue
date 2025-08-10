<template>
  <!-- Page shell: no vertical scroll here -->
  <div class="flex min-h-[calc(100vh-theme(spacing.20))]">

    <SidebarProvider class="flex w-full min-h-0">
      <!-- Sidebar: full height + sticky -->
      <Sidebar
        collapsible="none"
        class="hidden md:flex sticky top-0 h-[calc(100vh-theme(spacing.20))] border-r overflow-hidden"
      >
        <SidebarContent class="h-full overflow-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="item in data.nav" :key="item.name">
                  <SidebarMenuButton as-child :is-active="item.name === 'Messages & media'">
                    <a href="#">
                      <component :is="item.icon" />
                      <span>{{ item.name }}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <!-- Main column -->
      <main class="flex-1 min-h-0 flex flex-col">
        <header
          class="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear
                 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Messages & media</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <!-- Only this area scrolls -->
        <div class="flex-1 min-h-0  overflow-auto p-4 pt-0 max-h-[calc(100vh-theme(spacing.36))]">
          <div
            v-for="i in 10"
            :key="i"
            class="aspect-video max-w-3xl rounded-xl my-4 bg-muted/50"
          />
        </div>
      </main>
    </SidebarProvider>

  </div>
</template>

<script lang="ts" setup>
import {
  Bell, Check, Globe, Home, Keyboard, Link, Lock, Menu, MessageCircle,
  Paintbrush, Settings, Video
} from "lucide-vue-next"

definePageMeta({
  breadcrumb: [{ label: "อีเมล" }],
})

const data = {
  nav: [
    { name: "Notifications", icon: Bell },
    { name: "Navigation", icon: Menu },
    { name: "Home", icon: Home },
    { name: "Appearance", icon: Paintbrush },
    { name: "Messages & media", icon: MessageCircle },
    { name: "Language & region", icon: Globe },
    { name: "Accessibility", icon: Keyboard },
    { name: "Mark as read", icon: Check },
    { name: "Audio & video", icon: Video },
    { name: "Connected accounts", icon: Link },
    { name: "Privacy & visibility", icon: Lock },
    { name: "Advanced", icon: Settings },
  ],
}
const open = ref(true)
</script>
