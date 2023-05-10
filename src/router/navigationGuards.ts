import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import type { NavigationGuardWithThis } from 'vue-router'

const timeoutPromise = <T>(delay: number, data: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(data), delay))

const navigationGuards: NavigationGuardWithThis<undefined> = async (to, from) => {
  const { isAuthenticated, clientSetupPromise } = storeToRefs(useAuthStore())

  // Wait until client is ready, but timeout after 8 seconds
  const result = await Promise.race([
    clientSetupPromise.value,
    timeoutPromise(8000, { timedOut: true })
  ])

  // Check for time out
  if (result instanceof Object && 'timedOut' in result) {
    alert('Failed to connect to keycloak server')
  }

  if (isAuthenticated.value == false) {
    if (to.name !== 'login') return { name: 'login' }
  } else if (to.name === 'login') return { name: 'home' }
}

export default navigationGuards
