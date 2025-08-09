<template>
  <BaseCard class="w-full">
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-2">
      <!-- ✅ ไม่มี a ซ้อน button อีกต่อไป -->
      <BaseButton to="/invoices/create" variant="outline" class="w-full justify-start rounded-md">
        <Plus class="w-4 h-4 mr-2" />
        Create Invoice
      </BaseButton>

      <BaseButton variant="outline" class="w-full justify-start rounded-md">
        <UserPlus class="w-4 h-4 mr-2" />
        Add Clients
      </BaseButton>

      <BaseButton variant="outline" class="w-full justify-start rounded-md">
        <FileText class="w-4 h-4 mr-2" />
        View Reports
      </BaseButton>
    </CardContent>
  </BaseCard>
</template>

<script setup lang="ts">
import { Plus, UserPlus, FileText } from 'lucide-vue-next'
</script>
