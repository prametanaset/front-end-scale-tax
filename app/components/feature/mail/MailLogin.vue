<template>
  <div class="flex flex-col items-center z-10">
    <div class="mb-2">
      <!-- <Mail
          class="text-primary-500 w-[5rem] h-[5rem] bg-gradient-to-r from-indigo-600 to-cyan-400 text-transparent bg-clip-text"
        /> -->
      <Mail class="w-[5rem] h-[5rem] text-primary-500" />
    </div>

    <h1 class="text-xl font-semibold mb-2 text-center">ยินดีต้อนรับสู่เมล</h1>

    <Button
      variant="outline"
      type="button"
      class="py-2 sm:py-3 text-sm sm:text-sm rounded-full relative z-10 cursor-pointer mt-3"
    >
      <img
        src="/img/google.png"
        alt="Google logo"
        width="20"
        height="20"
        class="mr-2 h-5 w-5"
      />
      เชื่อมต่อกับ Google
    </Button>
    <div class="flex mt-2 items-end gap-2">
      <p class="text-xs text-gray-500 mt-6 max-w-xs text-center">
        การ "เชื่อมต่อกับ Google" ด้านบน ถือว่าคุณรับทราบว่าคุณได้อ่านและเข้าใจ
        <a
          href="/terms"
          target="_blank"
          class="text-purple-500 hover:underline"
        >
          ข้อกำหนดและเงื่อนไข
        </a>
        และ
        <a
          href="/privacy"
          target="_blank"
          class="text-purple-500 hover:underline"
        >
          นโยบายความเป็นส่วนตัว
        </a>
        ที่เกี่ยวข้องกับการใช้งาน e-Tax Mail ของคุณ
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Mail } from "lucide-vue-next";
// const { signIn, data } = useAuth();

// const handleLogin = async () => {
//   await signIn("google");
// };

const acceptTerms = ref(true);
</script>
