import { useAuthStore } from '@/stores/auth'
import type { NavigationGuardWithThis } from 'vue-router'

const navigationGuards: NavigationGuardWithThis<undefined> = (to, from) => {
  const auth = useAuthStore()

  if (auth.isAuthenticated == false && to.name !== 'login') return { name: 'login' }
}

export default navigationGuards
