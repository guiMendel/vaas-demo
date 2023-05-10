import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import type { NavigationGuardWithThis } from 'vue-router'

const navigationGuards: NavigationGuardWithThis<undefined> = async (to, from) => {
  const { isAuthenticated, clientSetupPromise } = storeToRefs(useAuthStore())

  // Wait until client is ready
  await clientSetupPromise.value

  if (isAuthenticated.value == false) {
    if (to.name !== 'login') return { name: 'login' }
  } else if (to.name === 'login') return { name: 'home' }
}

export default navigationGuards
