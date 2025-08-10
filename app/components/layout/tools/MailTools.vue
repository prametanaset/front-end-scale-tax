<template>
  <div class="flex items-center w-full gap-4">
    <div class="relative w-full max-w-sm items-center">
      <Input id="search" type="text" placeholder="ค้นหาอีเมล" class="pl-10" />
      <span
        class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
      >
        <Search class="size-6 text-muted-foreground" />
      </span>
    </div>

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
import { CalendarDate, type DateValue } from "@internationalized/date";
import { Plus, Send, Search, CalendarIcon } from "lucide-vue-next";
import { cn } from "~/lib/utils"; // Add this import for the cn utility

const showMail = ref("all");

const dateRange = ref({
  start: undefined,
  end: undefined,
}) as Ref<{ start: DateValue | undefined; end: DateValue | undefined }>;
</script>

<style></style>
