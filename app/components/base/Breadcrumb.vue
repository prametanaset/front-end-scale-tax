<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(item, index) in breadcrumbItems" :key="index">
        <BreadcrumbItem class="hidden md:block">
          <template v-if="item.href">
            <NuxtLink :to="item.href">
              <BreadcrumbLink>
                {{ item.label }}
              </BreadcrumbLink>
            </NuxtLink>
          </template>
          <template v-else>
            <BreadcrumbPage>
              {{ item.label }}
            </BreadcrumbPage>
          </template>
        </BreadcrumbItem>
        <BreadcrumbSeparator
          v-if="index < breadcrumbItems.length - 1"
          class="hidden md:block"
        />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

<script setup lang="ts">
const route = useRoute();

const breadcrumbItems = computed(() => {
  const meta = route.meta.breadcrumb as
    | { label: string; href?: string }[]
    | undefined;
  return meta ?? [];
});
</script>

<style></style>
