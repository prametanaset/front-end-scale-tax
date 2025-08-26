<template>
  <div class="flex flex-col items-center justify-center inset-0">
    <div
      class="absolute gradients-container w-screen min-h-[calc(100dvh-theme(spacing.20))] top-0 left-0 overflow-hidden"
    >
      <div class="g1"></div>
      <div class="g2"></div>
      <div class="g3"></div>
      <div class="g4"></div>
      <div class="g5"></div>
    </div>
    <div class="absolute top-[50%] translate-y-[-50%] flex flex-col items-center z-10">
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
      </div>
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
<style scoped>
.gradients-container > div {
  position: absolute;
  border-radius: 50%;
  filter: blur(150px);
  transform-origin: center;
  mix-blend-mode: normal;
  opacity: 0.5;
  animation: float 4s ease-in-out infinite, hueShift 10s linear infinite;
}

/* ขยับเบาๆ ด้วย float */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.05);
  }
}

/* เปลี่ยนสีด้วย hue-rotate */
@keyframes hueShift {
  0% {
    filter: blur(150px) hue-rotate(0deg);
  }
  100% {
    filter: blur(150px) hue-rotate(360deg);
  }
}

/* แต่ละ g ใช้ขนาดและตำแหน่งต่างกัน + delay ต่างกัน */
.g1 {
  width: 800px;
  height: 480px;
  top: 20%;
  left: 10%;
  background: radial-gradient(circle, #7873f5, transparent 70%);
  animation-delay: 0s, 0s;
}

.g2 {
  width: 1000px;
  height: 1200px;
  top: 50%;
  left: 30%;
  background: radial-gradient(circle, #ff6ec4, transparent 70%);
  animation-delay: 1s, 2s;
}

.g3 {
  width: 480px;
  height: 480px;
  top: 70%;
  left: 60%;
  background: radial-gradient(circle, #e74c3c, transparent 100%);
  animation-delay: 2s, 4s;
}

.g4 {
  width: 360px;
  height: 360px;
  top: 35%;
  left: 70%;
  background: radial-gradient(circle, #3a86ff, transparent 70%);
  animation-delay: 3s, 6s;
}

.g5 {
  width: 1000px;
  height: 1000px;
  top: 10%;
  left: 80%;
  background: radial-gradient(circle, #f0c27b, transparent 50%);
  animation-delay: 4s, 8s;
}
</style>
