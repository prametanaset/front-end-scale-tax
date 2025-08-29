<template>
  <DropdownMenu :class="cn('rounded-lg shadow-none', props.class)">
    <DropdownMenuTrigger as-child>

        <Avatar class="h-8 w-8 rounded-full">
          <AvatarImage :src="user.avatar" :alt="user.name" />
          <AvatarFallback class="rounded-full"> CN </AvatarFallback>
        </Avatar>

    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      :side="'top'"
      align="end"
      :side-offset="4"
    >
      <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar class="h-8 w-8 rounded-lg">
            <AvatarImage :src="user.avatar" :alt="user.name" />
            <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
          </Avatar>
          <span class="inline-grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">{{ user.name }}</span>
            <span class="truncate text-xs">{{ user.email }}</span>
          </span>
        </div>
        <div>
          <BaseModeSwitcher class="w-full" />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem class="cursor-pointer">
          <Sparkles />
          Upgrade to Pro
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem class="cursor-pointer">
          <BadgeCheck />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer">
          <CreditCard />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer">
          <Bell />
          Notifications
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <NuxtLink to="/login">
        <DropdownMenuItem class="cursor-pointer">
          <LogOut />
          Log out
        </DropdownMenuItem>
      </NuxtLink>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script lang="ts" setup>
import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-vue-next";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}>();
</script>

<style></style>
