<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(item, index) in breadcrumbItems" :key="item.href ?? item.label">
        <BreadcrumbItem >
          <!-- ลิงก์ปกติ: ใช้ asChild ป้องกัน <a> ซ้อน <a> -->
          <BreadcrumbLink v-if="item.href" asChild>
            <NuxtLink :to="item.href">
              {{ item.label }}
            </NuxtLink>
          </BreadcrumbLink>

          <!-- หน้า current: ไม่ใช้ BreadcrumbPage เพื่อเลี่ยง role="link" -->
          <span
            v-else
            aria-current="page"
            class="text-foreground md:font-normal"
          >
            {{ item.label }}
          </span>
        </BreadcrumbItem>

        <BreadcrumbSeparator
          v-if="index < breadcrumbItems.length - 1"
        />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

<script setup lang="ts">
const route = useRoute()
const breadcrumbItems = computed(() => {
  const meta = route.meta.breadcrumb as { label: string; href?: string }[] | undefined
  return meta ?? []
})
</script>
