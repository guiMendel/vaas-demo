import { defineStore } from 'pinia'
import { ref } from 'vue'
import Keycloak from 'keycloak-js'

export const useAuthStore = defineStore('auth', () => {
  // Whether user is authenticated
  const isAuthenticated = ref(false)

  // Create keycloak client instance
  const client = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT
  })

  client
    // .init({})
    .init({ onLoad: 'check-sso' })
    .then((authenticated) => (isAuthenticated.value = authenticated))
    .catch((reason) => {
      if (reason) console.error(reason)
    })

  return { isAuthenticated }
})
