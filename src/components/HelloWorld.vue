<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <p>
    yeah boy
    <v-icon class="icon" icon="fas fa-plus" />
  </p>
</template>

<style lang="scss" scoped>
p {
  .icon {
    background-color: red;
    color: black;
  }
}
</style>
