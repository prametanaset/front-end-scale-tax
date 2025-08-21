<template>
  <Tabs v-model="colorMode.preference" class="w-[400px]">
    <TabsList>
      <TabsTrigger value="light" class="cursor-pointer"><SunIcon /> </TabsTrigger>
      <TabsTrigger value="dark" class="cursor-pointer"><MoonIcon /></TabsTrigger>
      <TabsTrigger value="system" class="cursor-pointer"><Monitor /></TabsTrigger>
    </TabsList>
  </Tabs>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon, Monitor } from "lucide-vue-next";

const colorMode = useColorMode();
</script>
