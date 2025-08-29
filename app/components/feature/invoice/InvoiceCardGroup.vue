<template>
  <div class="rounded-xl grid grid-cols-1 sm:grid-cols-1 gap-4">
    <template v-if="loading">
      <div class="flex flex-col gap-2">
        <Skeleton class="rounded-xl h-10 w-1/3" />
        <Skeleton class="rounded-xl flex-1" />
      </div>
      <div class="flex flex-col gap-2">
        <Skeleton class="rounded-xl h-10 w-1/3" />
        <Skeleton class="rounded-xl flex-1" />
      </div>
    </template>
    <template v-else>
      <!-- <BaseCard>
        <CardHeader >
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </BaseCard> -->
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  loading?: boolean
}>()

const loading = props.loading ?? false
</script>
