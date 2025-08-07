<template>
  <div class="space-y-4">
    <!-- cards skeleton -->
    <div class="rounded-xl grid grid-cols-1 gap-2 w-full">
      <div class="flex flex-row justify-between w-full gap-2">
        <Skeleton class="rounded-xl h-10 w-1/3" />
        <Skeleton class="rounded-xl h-10 w-1/3" />
      </div>
    </div>

    <!-- table + note skeleton -->
    <div class="flex flex-col gap-4">
      <Skeleton class="rounded-xl h-[50vh]" />
    </div>
  </div>
</template>
