import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Whether user is authenticated
  const isAuthenticated = ref(false)

  return { isAuthenticated }
})
