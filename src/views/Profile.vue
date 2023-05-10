<script setup lang="ts">
import UserAvatar from '@/components/UserAvatar.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

// === USER INFO

const auth = useAuthStore()
const { signOut } = auth
const { userProfile } = storeToRefs(auth)

const name = computed(() => {
  let name = ''
  if (userProfile.value?.firstName != undefined) name += userProfile.value.firstName + ' '
  if (userProfile.value?.lastName != undefined) name += userProfile.value.lastName

  return name.trim()
})
</script>

<template>
  <VCard
    v-if="userProfile != undefined"
    class="d-flex flex-column"
    style="box-shadow: none; gap: 1rem"
  >
    <template v-slot:prepend>
      <UserAvatar :user="userProfile" style="font-size: 3rem" editable />
    </template>

    <VCardTitle class="text-h4" style="line-height: 1.5rem">{{ name }}</VCardTitle>

    <VCardSubtitle class="text-h6" style="line-height: 1.4rem">{{
      userProfile?.email
    }}</VCardSubtitle>

    <VCardActions>
      <VBtn prepend-icon="fas fa-sign-out-alt" class="px-5" color="red" @click="signOut"
        >Sign Out</VBtn
      >
    </VCardActions>
  </VCard>
</template>
