<script lang="ts" setup>
import SideBar from './components/SideBar.vue'
import Gallery from './views/Gallery.vue'
</script>

<template>
  <div>
    <VApp>
      <SideBar />

      <VMain class="main-content ma-5 mt-16 mt-sm-5">
        <Gallery />
      </VMain>
    </VApp>
  </div>
</template>
