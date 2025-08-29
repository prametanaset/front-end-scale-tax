<script setup lang="ts">
import { useFocus } from "@vueuse/core";
import { shallowRef } from "vue";

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
