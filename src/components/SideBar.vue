<script setup lang="ts">
import { useMobileSettingsStore } from '@/stores/mobileSettings'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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

const navigate = (page: string) => router.push({ name: page })
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
      // backgroundColor: 'white',
      // aspectRatio: '1/1',
      // borderRadius: ''
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
        prepend-avatar="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
        title="Ian Smith"
        subtitle="ian.smith@vaas.com"
      />
    </VList>

    <!-- Navigation Links -->
    <VList @click="setMobile(false)" item-value="clients" nav>
      <VListItem
        prepend-icon="fas fa-users"
        value="clients"
        title="Client Index"
        @click="navigate('clients')"
      />
      <VListItem
        prepend-icon="fas fa-search-dollar"
        value="transaction"
        title="Safe Transaction"
        @click="navigate('transaction')"
      />
      <VListItem
        prepend-icon="fas fa-images"
        value="gallery"
        title="Gallery"
        @click="navigate('gallery')"
      />
    </VList>
  </VNavigationDrawer>
</template>
