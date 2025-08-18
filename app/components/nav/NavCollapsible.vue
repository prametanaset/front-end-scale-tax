<template>
  <SidebarMenu>
    <Collapsible
      v-for="item in items"
      :key="item.title"
      as-child
      :default-open="item.isActive"
    >
      <SidebarMenuItem>
        <SidebarMenuButton as-child :tooltip="item.title">
          <a :href="item.url">
            <component :is="item.icon" />
            <span>{{ item.title }}</span>
          </a>
        </SidebarMenuButton>

        <template v-if="item.items?.length">
          <CollapsibleTrigger as-child class="cursor-pointer">
            <SidebarMenuAction class="data-[state=open]:rotate-90">
              <ChevronRight />
              <span class="sr-only">Toggle</span>
            </SidebarMenuAction>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem
                v-for="subItem in item.items"
                :key="subItem.title"
              >
                <SidebarMenuSubButton as-child>
                  <a :href="subItem.url">
                    <span>{{ subItem.title }}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </template>
      </SidebarMenuItem>
    </Collapsible>
  </SidebarMenu>
</template>

<script lang="ts" setup>
import { ChevronRight, type LucideIcon } from "lucide-vue-next";

defineProps<{
  items: {
    title: string;
    url?: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}>();
</script>

<style></style>
