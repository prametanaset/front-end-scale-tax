<template>
  <BaseCard class="w-full">
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-2">
      <NuxtLink to="/invoices/create">
        <BaseButton variant="outline" class="w-full justify-start rounded-md">
          <Plus class="w-4 h-4 mr-2" />
          Create Invoice
        </BaseButton>
      </NuxtLink>
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, FileText } from "lucide-vue-next";
</script>
