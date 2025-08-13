<template>
  <!-- Page shell: no vertical scroll here -->
  <div class="flex min-h-[calc(100vh-theme(spacing.20))] overflow-hidden">
    <FeatureMailLogin />
  </div>
</template>

<script lang="ts" setup>
import {
  Bell,
  Check,
  Globe,
  Home,
  Keyboard,
  Link,
  Lock,
  Menu,
  MessageCircle,
  Paintbrush,
  Settings,
  Video,
} from "lucide-vue-next";

definePageMeta({
  breadcrumb: [{ label: "อีเมล" }],
  name: "mail",
});

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
};
const open = ref(true);
</script>
