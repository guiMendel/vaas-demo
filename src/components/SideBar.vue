<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { computed } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'

// === MOBILE DETECTION

// Whether the viewport is mobile
const isMobile = ref(false)

// Update isMobile to ensure it's accurate
const detectMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', detectMobile)
  detectMobile()
})
onBeforeUnmount(() => window.removeEventListener('resize', detectMobile))

// === MOBILE TOGGLE

// Whether mobile's sidebar visibility is requested
const mobileToggled = ref(false)

const setMobile = (value: boolean) => (mobileToggled.value = value)
const toggleMobile = () => setMobile(!mobileToggled.value)
</script>

<template>
  <!-- Show open icon when mobile -->
  <VIcon @click="toggleMobile" icon="fas fa-bars" style="position: fixed; top: 1rem; left: 1rem" />

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
    <VList nav @click="setMobile(false)">
      <VListItem prepend-icon="fas fa-users" value="clients" title="Client Index" />
      <VListItem prepend-icon="fas fa-search-dollar" value="transaction" title="Safe Transaction" />
      <VListItem prepend-icon="fas fa-images" value="gallery" title="Gallery" />
    </VList>
  </VNavigationDrawer>
</template>
