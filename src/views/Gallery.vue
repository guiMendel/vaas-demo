<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  modelValue: number | undefined
  page: string
  count: number
}>()
const emit = defineEmits(['update:modelValue'])

const getId = (index: number) => index * 10 + parseInt(props.page)
const select = (index: number) => {
  emit('update:modelValue', getId(index) == props.modelValue ? undefined : getId(index))
}

watch(props, console.log)
</script>

<template>
  <VRow>
    <VCol v-for="n in count" :key="n" cols="4" sm="3" lg="2">
      <VCard
        class="rounded-circle"
        :variant="getId(n) == modelValue ? 'elevated' : 'plain'"
        :style="{
          cursor: 'pointer',
          border: getId(n) == modelValue ? '5px solid yellow' : '5px solid rgba(0,0,0,0)'
        }"
        @click="select(n)"
      >
        <VImg
          :src="`https://picsum.photos/500/300?image=${getId(n)}`"
          :lazy-src="`https://picsum.photos/10/6?image=${getId(n)}`"
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
