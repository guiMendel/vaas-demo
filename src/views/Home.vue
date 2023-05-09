<script lang="ts" setup>
import SideBar from '../components/SideBar.vue'
</script>

<template>
  <!-- Show dashboard sidebar -->
  <SideBar />

  <!-- Main content of dashboard -->
  <VMain class="main-content ma-5 mt-16 mt-sm-5 d-flex align-center justify-center">
    <RouterView />
  </VMain>
</template>
