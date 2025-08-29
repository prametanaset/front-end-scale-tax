<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <NuxtLink to="#">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <!-- <Command class="size-4" /> -->
                <!-- <Avatar class="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpX7YaLKKJiyF4MHkNB3FnOJaIYx3jC5YYQw&s"
                    alt="Logo"
                  />
                  <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
                </Avatar> -->
                <Command class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Sunscaleup</span>
                <span class="truncate text-xs">สำนักงานใหญ่</span>
              </div>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Quick</SidebarGroupLabel>
        <SidebarGroupContent>
          <NavSecondary :items="data.navQuick" />
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarGroupContent>
          <NavSecondary :items="data.navMain" />
        </SidebarGroupContent>
      </SidebarGroup>

      <DevOnly>
        <SidebarGroup>
          <SidebarGroupLabel>Dev Mode</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavSecondary :items="data.navDev" />
          </SidebarGroupContent>
        </SidebarGroup>
      </DevOnly>

      <!-- <SidebarGroup>
        <SidebarGroupLabel>Collapsible</SidebarGroupLabel>
        <SidebarGroupContent>
          <NavCollapsible :items="data.navCollaps" />
        </SidebarGroupContent>
      </SidebarGroup> -->

      <SidebarGroup class="mt-auto">
        <div class="space-y-1">
          <Transition name="fade">
            <p
              v-if="open || isMobile"
              class="text-sm md:group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:pointer-events-none"
            >
              ใช้ไป {{ storageUsed }} GB จาก 10GB
            </p>
          </Transition>
          <!-- html-validate-disable prefer-native-element -->
          <Progress v-model="progress" class="w-[90%] mb-4" />
          <!-- html-validate-enable prefer-native-element -->
        </div>
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
import {
  Megaphone,
  PieChart,
  Home,
  Users,
  ShoppingBag,
  Send,
  LifeBuoy,
  FlaskConical,
  SquarePen,
} from "lucide-vue-next";
import { useSidebar, type SidebarProps } from "@/components/ui/sidebar";

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: "inset",
  collapsible: "icon",
});

const storageUsed = ref(0);
const progress = ref(0);

onMounted(() => {
  storageUsed.value = Math.floor(Math.random() * 9 + 1);
  progress.value = (storageUsed.value / 10) * 100;
});

const { open, isMobile } = useSidebar();
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://i.pravatar.cc/150",
  },
  navQuick: [
    {
      title: "ออกใบกำกับภาษี",
      url: "/invoices/create",
      icon: SquarePen,
    },
    {
      title: "อีเมล",
      url: "/mail",
      icon: Send,
    },
  ],
  navMain: [
    {
      title: "หน้าแรก",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "แคตตาล็อกสินค้า",
      url: "/catalogs",
      icon: ShoppingBag,
    },
    {
      title: "ลูกค้า",
      url: "/customers",
      icon: Users,
    },
    {
      title: "โฟลเดอร์",
      url: "/invoices/files",
      icon: PieChart,
    },
  ],
  navDev: [
    {
      title: "ทดสอบ",
      url: "/test",
      icon: FlaskConical,
    },
  ],
  navCollaps: [
    {
      title: "ใบกำกับภาษี",
      icon: PieChart,
      isActive: false,
      items: [
        { title: "รายการใบกำกับภาษี", url: "/invoices/list" },
        { title: "ไฟล์", url: "/invoices/files" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Megaphone,
    },
  ],
};
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
