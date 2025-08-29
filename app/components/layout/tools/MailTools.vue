<template>
  <div class="flex items-center w-full gap-4">
    <BaseSearchInput v-model="q" place-holder="ค้นหาอีเมล" />

    <Popover>
      <PopoverTrigger as-child>
        <Button
          id="date"
          :variant="'outline'"
          :class="
            cn(
              'w-fit justify-start px-2 font-normal',
              !dateRange && 'text-muted-foreground'
            )
          "
        >
          <CalendarIcon class="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <RangeCalendar
          locale="th"
          v-model="dateRange"
          :number-of-months="1"
          initial-focus
        />
      </PopoverContent>
    </Popover>
  </div>
</template>

<script lang="ts" setup>
import { type DateValue } from "@internationalized/date";
import {  CalendarIcon } from "lucide-vue-next";
import { cn } from "~/lib/utils"; // Add this import for the cn utility

const q = ref("");

const dateRange = ref({
  start: undefined,
  end: undefined,
}) as Ref<{ start: DateValue | undefined; end: DateValue | undefined }>;
</script>

<style></style>
