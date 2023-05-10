import { defineStore } from 'pinia'
import { ref } from 'vue'
import Keycloak, { type KeycloakProfile } from 'keycloak-js'

export const useAuthStore = defineStore('auth', () => {
  // Whether user is authenticated
  const isAuthenticated = ref(false)

  // Logged client profile
  const userProfile = ref<KeycloakProfile | undefined>(undefined)

  // Handle a keycloak promise error
  const handleError = (message: string) => (reason: any) => {
    alert(message)

    isAuthenticated.value = false
    if (reason) console.error(reason)
  }

  // Create keycloak client instance
  const client = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT
  })

  const syncClientVariables = async () => {
    isAuthenticated.value = client.authenticated == true

    return client.loadUserProfile().then((profile) => (userProfile.value = profile))
  }

  // Will be resolved once auth client is ready
  const clientSetupPromise = ref(
    client
      .init({ onLoad: 'check-sso' })
      .then(syncClientVariables)
      .catch(handleError('Failed to initialize keycloak client'))
  )

  // Logs-in through keycloak interface
  const goToSignIn = () =>
    client.login().then(syncClientVariables).catch(handleError('Sign in failed'))

  return { isAuthenticated, goToSignIn, clientSetupPromise, userProfile }
})
