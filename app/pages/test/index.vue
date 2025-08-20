<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { SunIcon, MoonIcon, Monitor } from "lucide-vue-next";

const colorMode = useColorMode(); // Ref<'light' | 'dark' | 'auto'>
</script>

<template>
  <Tabs v-model="colorMode" class="w-[400px]">
    <TabsList>
      <TabsTrigger value="light"><SunIcon /> </TabsTrigger>
      <TabsTrigger value="dark"><MoonIcon /></TabsTrigger>
      <TabsTrigger value="system"><Monitor /></TabsTrigger>
    </TabsList>
  </Tabs>
</template>
