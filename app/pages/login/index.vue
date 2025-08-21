<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="relative hidden bg-muted lg:block">
      <!-- ข้อความกลางจอ -->
      <span
        class="absolute inset-0 flex items-center justify-center pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10"
      >
        <!-- Sunscaleup -->
      </span>

      <!-- พื้นหลัง -->
      <!-- <ParticlesBg
        class="absolute inset-0"
        :quantity="100"
        :ease="100"
        :color="isDark ? '#FFF' : '#000'"
        :staticity="10"
        refresh
      /> -->
      <video
        muted
        autoplay
        loop
        playsinline
        class="w-full h-full object-cover"
        src="/videos/solar.mp4"
      ></video>

      <!-- Cursor -->
      <FluidCursor />
    </div>

    <!-- ขวา -->
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2">
        <a href="#" class="flex items-center gap-2 font-medium">
          <div
            class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
          >
            <Command class="h-4 w-4" />
          </div>
          Sunscaleup
        </a>
      </div>

      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <FeatureAuthLoginForm />
        </div>
      </div>

      <div
        class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary"
      >
        By clicking continue, you agree to our
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Command from "~/components/ui/command/Command.vue";
import FluidCursor from "~/components/ui/fluid-cursor/FluidCursor.vue";
const isDark = computed(() => useColorMode().value == "dark");

definePageMeta({ layout: false });
</script>
