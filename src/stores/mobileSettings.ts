import { ref, onMounted, onBeforeUnmount } from 'vue'
import { defineStore } from 'pinia'

export const useMobileSettingsStore = defineStore('mobile-settings', () => {
  // Whether the viewport is mobile
  const isMobile = ref(false)

  // Update isMobile to ensure it's accurate
  const detectMobile = () => {
    isMobile.value = window.innerWidth <= 600
  }

  onMounted(() => {
    window.addEventListener('resize', detectMobile)
    detectMobile()
  })

  onBeforeUnmount(() => window.removeEventListener('resize', detectMobile))

  return { isMobile }
})
