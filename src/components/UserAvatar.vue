<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import Gallery from '@/views/Gallery.vue'
import type { KeycloakProfile } from 'keycloak-js'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { computed } from 'vue'

defineProps<{ editable?: boolean }>()
const { userProfile, userPictureId } = storeToRefs(useAuthStore())

// Avatar text
const avatarText = computed(() => {
  let text = ''
  if (userProfile.value?.firstName != undefined)
    text += userProfile.value.firstName.charAt(0).toUpperCase()
  if (userProfile.value?.lastName != undefined)
    text += userProfile.value.lastName.charAt(0).toUpperCase()

  return text
})

// Whether is currently editing
const editing = ref(false)

// Current page of panel
const panelPage = ref('0')
</script>

<template>
  <div style="position: relative">
    <!-- Text avatar -->
    <VAvatar
      style="min-width: 2em; min-height: 2em"
      color="blue"
      class="d-flex align-center justify-center"
    >
      <template v-if="userPictureId == undefined">
        {{ avatarText }}
      </template>

      <VImg v-else :src="`https://picsum.photos/1000/600?image=${userPictureId}`" cover />
    </VAvatar>

    <!-- Edit button -->
    <VAvatar
      v-if="editable"
      style="position: absolute; bottom: 0; right: 0; font-size: 0.23em; cursor: pointer"
      size="35"
      icon="fas fa-pencil"
      color="grey-lighten-2"
      class="d-flex align-center justify-center elevation-4"
      v-ripple
      @click="editing = true"
    />

    <!-- Edit panel -->
    <VDialog v-model="editing">
      <VCard
        variant="elevated"
        class="px-5 pt-3 pb-7 mx-auto"
        style="width: 100%; max-width: 100%"
        prepend-icon="fas fa-images"
        title="Edit Avatar"
        subtitle="Pick a new avatar picture from the gallery"
      >
        <Gallery v-model="userPictureId" :count="24" :page="panelPage" class="my-5" />

        <!-- Page set -->
        <VTextField variant="underlined" label="Page" type="number" class="mx-auto" v-model="panelPage" :min="0" style="width: 5rem" />
      </VCard>
    </VDialog>
  </div>
</template>
