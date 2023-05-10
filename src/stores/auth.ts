import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import Keycloak, { type KeycloakProfile } from 'keycloak-js'
import { useStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {
  // Avatar picture id storage
  const avatarPictureIdStorage = useStorage<{ [key: string]: number }>('user-picture-id', {})

  // Whether user is authenticated
  const isAuthenticated = ref(false)

  // Logged client profile
  const userProfile = ref<KeycloakProfile | undefined>(undefined)

  // Access to logged user's picture id
  const userPictureId = computed({
    get: () =>
      userProfile.value?.username
        ? avatarPictureIdStorage.value[userProfile.value.username]
        : undefined,

    set: (newId) => {
      if (userProfile.value?.username == undefined) return

      if (newId == undefined) delete avatarPictureIdStorage.value[userProfile.value.username]
      else avatarPictureIdStorage.value[userProfile.value.username] = newId
    }
  })

  // Handle a keycloak promise error
  const handleError = (message: string | undefined) => (reason: any) => {
    if (message != undefined) alert(message)

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

    return client
      .loadUserProfile()
      .then((profile) => (userProfile.value = profile))
      .catch(handleError(undefined))
  }

  // Will be resolved once auth client is ready
  const clientSetupPromise = ref(client.init({ onLoad: 'check-sso' }).then(syncClientVariables))

  // Logs-in through keycloak interface
  const goToSignIn = () =>
    client.login().then(syncClientVariables).catch(handleError('Sign in failed'))

  const signOut = () =>
    client.logout().then(syncClientVariables).catch(handleError('Sign out failed'))

  return { isAuthenticated, goToSignIn, signOut, clientSetupPromise, userProfile, userPictureId }
})
