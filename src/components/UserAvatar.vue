<script setup lang="ts">
import type { KeycloakProfile } from 'keycloak-js'
import { computed } from 'vue'

const { user } = defineProps<{ user: KeycloakProfile }>()

// Avatar text
const avatarText = computed(() => {
  let text = ''
  if (user.firstName != undefined) text += user.firstName.charAt(0).toUpperCase()
  if (user.lastName != undefined) text += user.lastName.charAt(0).toUpperCase()

  return text
})
</script>

<template>
  <VAvatar style="min-width: 2em; min-height: 2em;" color="blue" class="d-flex align-center justify-center pb-1"> {{ avatarText }} </VAvatar>
</template>
