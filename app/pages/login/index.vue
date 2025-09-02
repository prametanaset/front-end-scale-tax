<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="relative hidden bg-muted lg:block">
      <!-- ข้อความกลางจอ -->
      <span
        class="absolute inset-0 flex items-center justify-center pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10"
      >
        <!-- Sunscaleup -->
      </span>

      <video
        muted
        autoplay
        loop
        playsinline
        class="w-full h-full object-cover"
        src="/videos/solar.mp4"
      ></video>

      <!-- Cursor -->
      <FluidCursor />
    </div>

    <!-- ขวา -->
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2">
        <a href="#" class="flex items-center gap-2 font-medium">
          <div
            class="flex h-8 w-8 items-center justify-center"
          >
            <!-- <Command class="h-4 w-4" /> -->
             <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
          class="-mr-1"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0,300) scale(0.1,-0.1)"
            fill="#ff4200"
            stroke="none"
          >
            <path
              d="M1161 2370 c-155 -165 -292 -312 -304 -327 -20 -26 -22 -36 -17 -132 l5 -103 350 373 c193 205 350 378 350 384 0 7 -23 33 -51 58 l-51 46 -282 -299z"
            />
            <path
              d="M1472 2320 l-73 -80 520 0 521 0 0 80 0 80 -447 0 -448 0 -73 -80z"
            />
            <path
              d="M570 1927 l0 -443 73 -72 c40 -39 76 -72 80 -72 4 0 7 232 7 515 l0 515 -80 0 -80 0 0 -443z"
            />
            <path
              d="M2005 2151 l-79 -6 334 -314 c184 -173 354 -333 378 -355 l43 -41 49 55 c27 30 48 58 47 61 -1 4 -146 142 -322 308 -256 240 -325 300 -345 299 -14 -1 -61 -4 -105 -7z"
            />
            <path
              d="M1400 1861 c-108 -35 -200 -113 -247 -209 -25 -51 -28 -67 -28 -162 0 -99 2 -110 32 -171 142 -288 553 -281 692 11 23 48 26 68 26 160 0 95 -3 111 -28 162 -37 76 -101 139 -178 179 -56 29 -75 33 -154 36 -49 1 -101 -1 -115 -6z m199 -171 c56 -28 107 -93 121 -151 23 -94 -21 -196 -107 -246 -39 -23 -60 -28 -113 -28 -111 0 -193 65 -221 177 -22 93 29 200 120 248 50 26 149 27 200 0z"
            />
            <path
              d="M2270 1176 l0 -516 80 0 80 0 0 443 0 443 -62 60 c-35 33 -71 66 -80 73 -17 13 -18 -13 -18 -503z"
            />
            <path
              d="M266 1499 c-25 -28 -46 -54 -45 -58 1 -11 640 -606 650 -605 5 1 52 2 105 3 53 0 94 5 92 10 -5 12 -740 701 -749 701 -4 0 -28 -23 -53 -51z"
            />
            <path
              d="M1836 796 c-193 -205 -352 -378 -353 -383 -2 -6 20 -32 50 -57 l54 -46 80 82 c44 46 155 164 248 263 93 99 194 207 225 240 l57 60 -6 107 -6 106 -349 -372z"
            />
            <path
              d="M562 643 l3 -78 440 -2 c242 -2 445 1 450 5 6 4 41 40 80 80 l69 72 -522 0 -523 0 3 -77z"
            />
          </g>
        </svg>
          </div>
          Sunscaleup
           
        </a>
      </div>

      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <FeatureAuthLoginForm />
        </div>
      </div>

      <div
        class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary"
      >
        By clicking continue, you agree to our
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
</script>
