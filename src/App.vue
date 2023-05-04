<script lang="ts" setup>
import SideBar from './components/SideBar.vue'
import Gallery from './views/Gallery.vue'
</script>

<template>
  <div>
    <VApp>
      <SideBar />

      <VMain class="main-content">
        <Gallery />
      </VMain>
    </VApp>
  </div>
</template>

<style lang="scss">
.main-content {
  margin: 2rem;

  @media (max-width: 768px) {
    margin-top: 4rem;
  }
}
</style>
