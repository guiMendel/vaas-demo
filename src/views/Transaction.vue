<script setup lang="ts">
import formatBalance from '@/helpers/formatBalance'
import randomAddress from '@/helpers/randomAddress'
import { useClientsStore } from '@/stores/clients'
import { useMobileSettingsStore } from '@/stores/mobileSettings'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { ref } from 'vue'

const { isMobile } = storeToRefs(useMobileSettingsStore())

// Get all clients
const { clients } = storeToRefs(useClientsStore())
const clientList = computed(() => Object.keys(clients.value).map((id) => clients.value[id]))

// Currently selected client id
const selectedClientId = ref<string | undefined>(undefined)
const selectedClient = computed(() =>
  selectedClientId.value ? clients.value[selectedClientId.value] : undefined
)

// Transfer amount
const amount = ref(0)

// Receiver address
const receiverAddress = ref('')
</script>

<template>
  <div class="w-100" :style="{ 'padding-inline': isMobile ? '10%' : '20%' }">
    <!-- Sender header -->
    <span style="color: gray">Sender</span>
    <VDivider class="mb-8" />

    <!-- Select client -->
    <VSelect
      label="Client"
      v-model="selectedClientId"
      :items="clientList"
      item-title="name"
      item-value="id"
    />

    <!-- Select value -->
    <div class="d-flex align-start mb-8">
      <!-- Input value -->
      <VTextField label="Value" style="flex: 1" type="number" min="0" v-model="amount" />

      <!-- Available balance -->
      <div style="flex: 0.5" class="d-flex flex-column align-center justify-center mt-2">
        <small style="color: gray">Total Balance</small>
        <span class="font-weight-bold">{{ formatBalance(selectedClient?.balance) }}</span>
      </div>
    </div>

    <!-- Receiver header -->
    <span style="color: gray">Receiver</span>
    <VDivider class="mb-8" />

    <!-- Receiver address -->
    <VTextField label="Address" v-model="receiverAddress">
      <template v-slot:append-inner>
        <VTooltip text="Generate random address" location="bottom">
          <template v-slot:activator="{ props }">
            <VBtn
              icon="fas fa-dice"
              v-bind="props"
              variant="text"
              class="d-flex align-center justify-center mt-n3 pr-2 pb-1"
              @click="receiverAddress = randomAddress()"
            />
          </template>
        </VTooltip>
      </template>
    </VTextField>
  </div>
</template>
