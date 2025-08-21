<template>
  <div>
    <BaseDialog
      v-model="open"
      title="Delete Product"
      description="Are you sure you want to delete this product?"
      text="Delete"
      bgButton="bg-red-500 text-white"
      :showButton="true"
    >
      <!-- ✅ Custom trigger (optional) -->
      <template #trigger>
        <Button variant="destructive">Custom Trigger</Button>
      </template>

      <!-- ✅ Dialog content -->
      <template #content>
        <p class="px-4">
          This action cannot be undone. It will permanently remove the product.
        </p>
      </template>

      <!-- ✅ Footer -->
      <template #footer>
        <Button variant="outline" @click="open = false">Cancel</Button>
        <Button variant="destructive" @click="confirmDelete">Confirm</Button>
      </template>
    </BaseDialog>
  </div>
</template>
<script setup lang="ts">
const open = ref(true);

function confirmDelete() {
  console.log("deleted!");
  open.value = false;
}
</script>

<style></style>
