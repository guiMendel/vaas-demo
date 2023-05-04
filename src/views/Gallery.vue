<script setup lang="ts">
import { useMobileSettingsStore } from '@/stores/mobileSettings'
import { storeToRefs } from 'pinia'

// Whether the viewport is mobile
const { isMobile } = storeToRefs(useMobileSettingsStore())
</script>

<template>
  <VRow>
    <VCol v-for="n in 200" :key="n" cols="4" sm="3" lg="2">
      <VCard>
        <VImg
          :src="`https://picsum.photos/500/300?image=${n * 3 + 5}`"
          :lazy-src="`https://picsum.photos/10/6?image=${n * 3 + 5}`"
          aspect-ratio="1"
          cover
        >
          <template v-slot:placeholder>
            <VRow align="center" justify="center" class="fill-height ma-0">
              <VProgressCircular indeterminate color="grey-lighten-5" size="60" width="8" />
            </VRow>
          </template>
        </VImg>
      </VCard>
    </VCol>
  </VRow>
</template>
