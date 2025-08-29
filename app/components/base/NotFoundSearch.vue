<template>
  <ClientOnly>
    <div class="relative w-full overflow-hidden bg-background">
      <FlickeringGrid
        class="relative inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
        :square-size="4"
        :grid-gap="6"
        color="#60A5FA"
        :max-opacity="0.5"
        :flicker-chance="0.1"
        :width="1200"
        :height="600"
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="flex flex-col items-center space-x-4">
          <SearchX :size="100" />
          <span class="text-xl"
            >ไม่พบผลการค้นหา "{{
              toolsStore.query ? toolsStore.query : ""
            }}"</span
          >
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { SearchX } from "lucide-vue-next";
import FlickeringGrid from "~/components/ui/flickering-grid/FlickeringGrid.vue";

const toolsStore = useToolsStore();
</script>

<style></style>
