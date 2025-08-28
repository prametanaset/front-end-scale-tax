<template>
  <nav
    aria-label="Bottom Navigation"
    class="fixed bottom-0 left-0 right-0 z-50 border-t bg-background"
  >
    <div class="flex h-14 w-full items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
      <NuxtLink
        v-for="item in resolvedItems"
        :key="item.label"
        :to="item.to"
        no-prefetch
        class="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus:text-foreground"
        :class="isActive(item.to) ? 'text-foreground' : ''"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <component :is="item.icon" class="h-6 w-6" />
        <span class="text-xs">{{ item.label }}</span>
      </NuxtLink>
      <NavUserMobile :user="data.user" class="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus:text-foreground"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
// ไอคอนจาก shadcn/vue (lucide)
import { Home, Search, User, Settings, SquarePlus } from 'lucide-vue-next'

type Item = { label: string; to: string; icon: any }

const props = defineProps<{
  items?: Item[]
}>()

const route = useRoute()

const defaultItems: Item[] = [
  { label: 'หน้าหลัก', to: '/dashboard', icon: Home },
  { label: 'ลูกค้า', to: '/customers', icon: Search },
  { label: 'ออกใบกำกับ', to: '/test', icon: SquarePlus },
  { label: 'สินค้า', to: '/catalogs', icon: User },
]

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://i.pravatar.cc/150",
  },
}

const resolvedItems = computed(() => props.items ?? defaultItems)

const isActive = (to: string) => computed(() => {
  if (to === "/") return route.path === "/"
  return route.path === to || route.path.startsWith(to + "/")
})
</script>
