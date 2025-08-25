<script setup lang="ts">
import { computed, onMounted, ref, watch, h } from "vue"
import { toast } from "vue-sonner"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-vue-next"

const props = defineProps<{
  title?: string
  text?: string
  confirmButton?: string
  cancelButton?: string
}>()

// $pwa ถูก inject โดย @vite-pwa/nuxt (อาจเป็น undefined)
const { $pwa } = useNuxtApp()
const hasShown = ref(false)

const canPrompt = computed(() => !!$pwa && $pwa.showInstallPrompt)

function showPwaInstallToast() {
  if (hasShown.value || !canPrompt.value) return
  hasShown.value = true

  toast.custom((t) =>
    h(
      "div",
      {
        class:
          "w-full max-w-sm rounded-lg border bg-background p-4 shadow-sm flex gap-3",
      },
      [
        // ไอคอน lucide
        h(
          "div",
          {
            class:
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
          },
          [h(Download, { class: "h-5 w-5" })]
        ),

        // เนื้อหาหลัก
        h("div", { class: "flex-1 space-y-1" }, [
          h(
            "div",
            { class: "text-sm font-semibold leading-none" },
            props.title ?? "ติดตั้งเป็นแอป?"
          ),
          h(
            "div",
            { class: "text-sm text-muted-foreground" },
            props.text ?? "เพิ่มแอปนี้ไปยังหน้าจอโฮม เพื่อเปิดใช้งานได้รวดเร็วขึ้น"
          ),

          // ปุ่มแอคชัน
          h(
            "div",
            { class: "mt-3 grid grid-cols-2 gap-2" },
            [
              // ปุ่มติดตั้ง
              h(
                Button,
                {
                  class: "w-full",
                  onClick: async () => {
                    try {
                      await $pwa?.install()
                    } finally {
                      toast.dismiss(t.id)
                    }
                  },
                },
                { default: () => props.confirmButton ?? "ติดตั้งเลย" }
              ),
              // ปุ่มภายหลัง
              h(
                Button,
                {
                  class: "w-full",
                  variant: "outline",
                  onClick: async () => {
                    try {
                      await $pwa?.cancelInstall?.()
                    } finally {
                      toast.dismiss(t.id)
                    }
                  },
                },
                { default: () => props.cancelButton ?? "ภายหลัง" }
              ),
            ]
          ),
        ]),

        // ปุ่มปิดมุมขวา
        h(
          "button",
          {
            class:
              "ms-auto -me-1 -mt-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            "aria-label": "Close",
            onClick: () => toast.dismiss(t.id),
          },
          "✕"
        ),
      ]
    ),
    {
      duration: 12000,
    }
  )
}

onMounted(() => {
  if (canPrompt.value) showPwaInstallToast()
})

watch(
  () => canPrompt.value,
  (v) => {
    if (v) showPwaInstallToast()
  }
)
</script>

<template>
  <!-- คอมโพเนนต์นี้ไม่มี UI เอง แค่ trigger toast -->
  <span class="hidden" />
</template>
