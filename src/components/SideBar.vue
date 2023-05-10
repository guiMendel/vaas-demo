<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useMobileSettingsStore } from '@/stores/mobileSettings'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// === USER INFO

const { userProfile } = storeToRefs(useAuthStore())

// === MOBILE DETECTION

// Whether the viewport is mobile
const { isMobile } = storeToRefs(useMobileSettingsStore())

// === MOBILE TOGGLE

// Whether mobile's sidebar visibility is requested
const mobileToggled = ref(false)

const setMobile = (value: boolean) => (mobileToggled.value = value)
const toggleMobile = () => setMobile(!mobileToggled.value)

// === PAGE TOGGLE

const router = useRouter()
</script>

<template>
  <!-- Show open icon when mobile -->
  <VAvatar
    icon="fas fa-bars"
    color="white"
    v-if="isMobile && mobileToggled == false"
    @click="toggleMobile"
    :style="{
      position: 'fixed',
      top: '1rem',
      left: '1rem',
      zIndex: 2000
    }"
  >
  </VAvatar>

  <VNavigationDrawer
    :permanent="isMobile == false"
    :expand-on-hover="isMobile == false"
    :rail="isMobile == false"
    app
    style="min-width: 3.3rem"
    :temporary="isMobile"
    :model-value="mobileToggled || isMobile == false"
    @update:model-value="setMobile"
  >
    <!-- User profile -->
    <VList style="margin-bottom: 2rem">
      <VListItem
        v-if="userProfile != undefined"
        :title="`${userProfile.firstName} ${userProfile.lastName}`"
        :subtitle="`${userProfile.email}`"
      >
        <template v-slot:prepend>
          <VAvatar color="blue" class="d-flex align-center justify-center pb-1">
            {{ userProfile.firstName?.charAt(0).toUpperCase()
            }}{{ userProfile.lastName?.charAt(0).toUpperCase() }}
          </VAvatar>
        </template>
      </VListItem>
    </VList>

    <!-- Navigation Links -->
    <VList @click="setMobile(false)" item-value="clients" nav>
      <VListItem
        prepend-icon="fas fa-users"
        value="clients"
        title="Client Index"
        @click="router.push({ name: 'clients' })"
      />
      <VListItem
        prepend-icon="fas fa-search-dollar"
        value="transaction"
        title="Safe Transaction"
        @click="router.push({ name: 'transaction', params: { selectedClientId: 'undefined' } })"
      />
      <VListItem
        prepend-icon="fas fa-images"
        value="gallery"
        title="Gallery"
        @click="router.push({ name: 'gallery' })"
      />
    </VList>
  </VNavigationDrawer>
</template>
