<script setup lang="ts">
import { useFocus } from "@vueuse/core";
import { shallowRef } from "vue";
useSeoMeta({
  title: "Sunscaleup | Test",
  ogTitle: "My Amazing Site",
  description: "This is my amazing site, let me tell you all about it.",
  ogDescription: "This is my amazing site, let me tell you all about it.",
  ogImage: "https://example.com/image.png",
  twitterCard: "summary_large_image",
});

const input = shallowRef();
const { focused } = useFocus(input);
</script>

<template>
  <div>
    <button type="button" @click="focused = true">
      Click me to focus input below
    </button>
    <input ref="input" type="text" />
  </div>
</template>
