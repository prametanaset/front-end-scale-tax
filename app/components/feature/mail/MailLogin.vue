<template>
    <AuroraBackground>
      <Motion
        as="div"
        :initial="{ opacity: 0, y: 40, filter: 'blur(10px)' }"
        :while-in-view="{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        }"
        :transition="{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }"
        class="relative flex flex-col items-center justify-center"
      >
        <div class="text-center text-3xl font-bold md:text-7xl dark:text-white">
          <Mail class="w-[7rem] h-[7rem] text-primary-500" />
        </div>
        <div class="text-center text-2xl font-bold  dark:text-white">
          <p>ยินดีต้อนรับสู่ เมล</p>
        </div>
        <div
          class="py-4 text-base font-extralight md:text-4xl dark:text-neutral-200"
        >
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
        </div>
        <p class="text-xs text-gray-500 mt-6 max-w-xs text-center">
          การ "เชื่อมต่อกับ Google" ด้านบน
          ถือว่าคุณรับทราบว่าคุณได้อ่านและเข้าใจ
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
      </Motion>
    </AuroraBackground>
</template>

<script lang="ts" setup>
import { Mail } from "lucide-vue-next";
import { Motion } from "motion-v";
import AuroraBackground from "~/components/ui/aurora-background/AuroraBackground.vue";
// const { signIn, data } = useAuth();

// const handleLogin = async () => {
//   await signIn("google");
// };

const acceptTerms = ref(true);
</script>

<style scoped>
@theme inline {
  --animate-aurora: aurora 60s linear infinite;
  @keyframes aurora {
    from {
      background-position:
        50% 50%,
        50% 50%;
    }
    to {
      background-position:
        350% 50%,
        350% 50%;
    }
  }
}

</style>
