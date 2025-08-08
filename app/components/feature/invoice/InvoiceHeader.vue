<template>
  <div class="grid grid-cols-1 gap-5 auto-rows-min">
    <!-- No. -->
    <div class="flex items-center gap-2 w-100">
      <Label class="w-20">เลขที่</Label>
      <Input
        type="text"
        placeholder="Enter invoice number"
        class="flex-1"
      />
    </div>

    <!-- Date -->
    <div class="flex items-center gap-2">
      <Label class="w-20">วันที่</Label>
      <BaseDatePicker class="flex-1 w-78"/>
      <!-- <Input type="datetime-local" placeholder="Datetime Local" class="flex-1"/> -->
    </div>

    <!-- Ref -->
    <div class="flex items-center gap-2">
      <Label class="w-20">Ref.</Label>
      <div>
        <template v-if="!selected">
          <Popover>
            <PopoverTrigger as-child>
              <BaseButton variant="outline" class="h-8 px-3"
                ><Plus class="h-4 w-4" /> เพิ่ม
              </BaseButton>
            </PopoverTrigger>

            <PopoverContent class="w-56 p-3 rounded-xl" align="start">
              <form @submit.prevent="onAdd" class="flex flex-col space-y-2">
                <Input
                  v-model="inputValue"
                  placeholder="e.g. INV-12345"
                  class="w-full"
                  autofocus
                />
                <Button type="submit" :disabled="!inputValue" class="w-full rounded-lg">
                  เพิ่ม
                </Button>
              </form>
            </PopoverContent>
          </Popover>
        </template>

        <template v-else>
          <Badge
            variant="secondary"
            class=" flex items-center rounded-sm px-2 font-normal rounded-full text-sm gap-1"
          >
            <span>{{ selected }}</span>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Remove"
              class="cursor-pointer p-0 w-6 h-6"
              @click="onRemove"
            >
              <X class="w-4 h-4" />
            </Button>
          </Badge>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, X } from "lucide-vue-next";

const inputValue = ref("");
const selected = ref<string | null>(null);

function onAdd() {
  selected.value = inputValue.value.trim();
  inputValue.value = "";
}

function onRemove() {
  selected.value = null;
}
</script>
