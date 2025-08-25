// stores/useBreakpointStore.ts
import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export type TailwindBpKey = keyof typeof breakpointsTailwind

export const useBreakpointStore = defineStore('breakpoints', () => {
  const breakpoints = useBreakpoints(breakpointsTailwind)

  // ค่า px ของ sm (ถ้าจะอ้างอิงตัวเลขดิบ)
  const smWidth = breakpointsTailwind.sm

  // ค่า breakpoint ปัจจุบันที่อยากเทียบ (แก้ได้ runtime)
  const reactiveStuff = shallowRef<TailwindBpKey>('sm')

  // helper จาก VueUse ที่อิง reactiveStuff
  const isGreaterThanBreakpoint = breakpoints.greaterOrEqual(() => reactiveStuff.value)

  // refs/booleans สำหรับใช้งานตรง ๆ
  const current = breakpoints.current()
  const active = breakpoints.active()

  const xs  = breakpoints.smaller('sm')
  const xse = breakpoints.smallerOrEqual('sm')

  const sm  = breakpoints.between('sm', 'md')
  const md  = breakpoints.between('md', 'lg')
  const lg  = breakpoints.between('lg', 'xl')
  const xl  = breakpoints.between('xl', '2xl')

  // ระวัง key '2xl' ต้องเข้าผ่าน indexer
  const xxl = breakpoints['2xl']

  // actions
  function setCompareBreakpoint(bp: TailwindBpKey) {
    reactiveStuff.value = bp
  }

  return {
    // state/refs
    reactiveStuff,
    smWidth,

    // helpers/booleans
    isGreaterThanBreakpoint,
    current,
    active,
    xs,
    xse,
    sm,
    md,
    lg,
    xl,
    xxl,

    // actions
    setCompareBreakpoint,
  }
})
