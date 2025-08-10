<template>
  <div class="flex flex-col items-start gap-4 md:flex-row">
    <Popover>
      <PopoverTrigger as-child>
        <Button
          type="button"
          :variant="'outline'"
          :class="
            cn(
              'min-w-[200px] justify-start px-2 font-normal cursor-pointer',
              !date && 'text-muted-foreground',
              props.class
            )
          "
        >
          <CalendarIcon class="text-muted-foreground" />
          {{
            date ? df.format(date.toDate(getLocalTimeZone())) : "เพิ่มวันที่"
          }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <Calendar v-model="date" initial-focus />
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { DateFormatter, getLocalTimeZone } from "@internationalized/date";

import { CalendarIcon, Proportions } from "lucide-vue-next";
import { cn } from "@/lib/utils";
const props = defineProps<{
  class?: string;
}>();

const date = ref() as Ref<DateValue>;

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});
</script>
