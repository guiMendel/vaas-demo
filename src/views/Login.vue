<template>
  <div class="d-flex h-100 w-100 align-center">
    <!-- Random image cover -->
    <div class="d-flex h-100" style="flex: 1.5">
      <VImg :src="`https://picsum.photos/1920/1080`" cover />
    </div>

    <!-- Start section -->
    <VCard class="d-flex flex-column h-100 justify-center pa-10 h-100" style="flex: 1; gap: 2rem">
      <VCardTitle class="text-h3 text-wrap font-weight-bold" style="line-height: 1em">Risk Assesser Demo</VCardTitle>
      <VCardSubtitle class="text-h6 text-wrap" style="line-height: 1.2em"
        >Please sign in via keycloak to start</VCardSubtitle
      >

      <VCardActions>
        <VBtn class="px-5" color="blue" prepend-icon="fas fa-sign-in-alt">Sign In</VBtn>
      </VCardActions>
    </VCard>
    <!-- <div class="d-flex h-100 align-center justify-center" style="flex: 1; box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.4); z-index: 10;">
      <VCard style="box-shadow: none;" title="Risk Assesser Demo" />
    </div> -->
  </div>
</template>
