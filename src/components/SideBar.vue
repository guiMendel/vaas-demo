<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useMobileSettingsStore } from '@/stores/mobileSettings'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserAvatar from './UserAvatar.vue'

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
        v-ripple
        style="cursor: pointer"
        @click="router.push({ name: 'profile' })"
      >
        <template v-slot:prepend> <UserAvatar :user="userProfile" class="mr-5" /> </template>
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
    </VList>
  </VNavigationDrawer>
</template>
