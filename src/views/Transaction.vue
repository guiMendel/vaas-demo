<script setup lang="ts">
import formatBalance from '@/helpers/formatBalance'
import { randomAddress, randomRangeInt } from '@/helpers/random'
import { useClientsStore } from '@/stores/clients'
import { useMobileSettingsStore } from '@/stores/mobileSettings'
import { useInstitutionsStore } from '@/stores/institutions'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { ref } from 'vue'
import validateAddress, { addressRules } from '@/helpers/validateAddress'
import { watch } from 'vue'
import type { Institution } from '@/types/Institution.interface'

const { isMobile } = storeToRefs(useMobileSettingsStore())

const { retrieveInstitution } = useInstitutionsStore()

// Get all clients
const clientStore = useClientsStore()
const { getByAddress: clientByAddress } = clientStore
const { clients } = storeToRefs(clientStore)
const clientList = computed(() => Object.keys(clients.value).map((id) => clients.value[id]))

// Currently selected client id
const selectedClientId = ref<string | undefined>(undefined)
const selectedClient = computed(() =>
  selectedClientId.value ? clients.value[selectedClientId.value] : undefined
)

// Transfer amount
const amount = ref(0)

// Whether client has enough funds
const hasFunds = computed(
  () => selectedClient.value != undefined && selectedClient.value.balance >= amount.value
)

// Receiver address
const receiverAddress = ref('')

const loadingAddressData = ref(false)
let loadingToken: number | null = null

// Start loading time whenever address changes
watch(receiverAddress, () => {
  if (loadingToken != null) {
    clearTimeout(loadingToken)
    loadingToken = null
  }

  loadingAddressData.value = true
  loadingToken = setTimeout(() => {
    loadingAddressData.value = false
    loadingToken = null
  }, randomRangeInt(300, 1500))
})

const assessingRisk = ref(false)
let assessmentToken: number | null = null

// Start loading time whenever address changes
watch(loadingAddressData, (value) => {
  if (value == false) return

  if (assessmentToken != null) {
    clearTimeout(assessmentToken)
    assessmentToken = null
  }

  if (addressedClient.value != undefined) return

  assessingRisk.value = true
  assessmentToken = setTimeout(() => {
    assessingRisk.value = false
    assessmentToken = null
  }, randomRangeInt(3500, 5000))
})

// Whether inserted address is valid
const addressValid = computed(() => validateAddress(receiverAddress.value) === true)

// Institution with the inserted valid address
const addressedInstitution = computed(() =>
  addressValid.value ? retrieveInstitution(receiverAddress.value) : undefined
)

// Client with the given valid address
const addressedClient = computed(() => clientByAddress(receiverAddress.value))

const risk = computed<Institution['risk'] | undefined>(() =>
  addressedClient.value ? 0 : addressedInstitution.value?.risk
)

const riskLabel = computed(() =>
  risk.value != undefined
    ? ['None', 'Very Low', 'Low', 'Average', 'High', 'Very High'][risk.value]
    : undefined
)

const riskColor = computed(
  () =>
    (risk.value != undefined &&
      assessingRisk.value == false &&
      ((risk.value == 0 && 'green') ||
        (risk.value <= 1 && 'green-darken-3') ||
        (risk.value <= 3 && 'yellow-darken-3') ||
        (risk.value == 4 && 'orange-accent-4') ||
        (risk.value == 5 && 'red'))) ||
    'grey'
)

const transactionInProgress = ref(false)
const showSuccess = ref(false)

const performTransaction = () => {
  if (selectedClient.value == undefined || hasFunds.value == false || transactionInProgress.value)
    return

  transactionInProgress.value = true

  setTimeout(() => {
    transactionInProgress.value = false

    if (selectedClient.value == undefined || hasFunds.value == false) return

    if (addressedClient.value != undefined) addressedClient.value.balance += amount.value

    selectedClient.value.balance -= amount.value
    amount.value = 0
    receiverAddress.value = ''
    showSuccess.value = true
  }, randomRangeInt(1000, 3000))
}
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
    <VTextField label="Address" v-model="receiverAddress" :rules="addressRules">
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

    <template v-if="addressValid">
      <!-- When loading -->
      <template v-if="loadingAddressData">
        <div class="d-flex align-center justify-center">
          <VProgressCircular indeterminate size="40" />
        </div>
      </template>

      <template v-else>
        <!-- For recognized clients -->
        <template v-if="addressedClient">
          <div class="d-flex flex-column">
            <small style="color: gray">Client Name</small>
            <span>{{ addressedClient.name }}</span>
          </div>
        </template>

        <!-- For institutions -->
        <template v-else-if="addressedInstitution">
          <div class="d-flex align-center">
            <div class="d-flex flex-column" style="flex: 1">
              <small style="color: gray">Institution Name</small>
              <span>{{ addressedInstitution.name }}</span>
            </div>

            <div class="d-flex flex-column" style="flex: 0.5">
              <small style="color: gray">Category</small>
              <span>{{ addressedInstitution.category }}</span>
            </div>
          </div>
        </template>

        <!-- Risk assessment -->
        <VCard
          variant="tonal"
          title="Risk Assessment"
          class="mt-10"
          :subtitle="assessingRisk ? 'Assessing risk...' : 'Assessment complete'"
          :color="riskColor"
        >
          <template v-slot:prepend>
            <VIcon
              :icon="`fas fa-shield${
                assessingRisk == false && risk != undefined && risk >= 4 ? '-virus' : ''
              }`"
            />
          </template>

          <VProgressLinear v-if="assessingRisk || risk == undefined" indeterminate height="5" />

          <VRow no-gutters v-else justify="center" align="center" class="mb-5 px-4">
            <!-- Risk -->
            <VCol cols="3" class="pr-3 py-5 text-center font-weight-bold">
              {{ riskLabel }}
            </VCol>

            <!-- Recommendation -->
            <VCol cols="9" class="pl-3 d-flex flex-column" style="line-height: 0.8rem; gap: 0.5rem">
              <small v-if="risk == 0">Receiver is trusted by Vaas</small>
              <small v-if="risk <= 1">Receiver has a legitimate track record</small>
              <small v-else-if="risk <= 3"
                >Receiver's activities are sparse, but no scam was reported so far
              </small>
              <small v-else>Receiver has been reported as scammer before</small>
              <small v-if="risk == 5"
                >Receiver is a known scammer in our records.
                <b>We strongly recommend against this transaction</b></small
              >
            </VCol>
          </VRow>
        </VCard>

        <!-- Transaction execution -->
        <VBtn
          block
          class="mt-10 py-6 mb-2"
          :color="hasFunds ? riskColor : 'grey'"
          :disabled="assessingRisk || hasFunds == false"
          prepend-icon="fas fa-coins"
          @click="performTransaction"
        >
          <VProgressCircular v-if="transactionInProgress" indeterminate />
          <span v-else>Perform Transaction</span>
        </VBtn>

        <VAlert type="warning" v-if="hasFunds == false" class="font-weight-medium">
          The selected client doesn't have enough funds for this transaction
        </VAlert>
      </template>
    </template>
  </div>

  <VSnackbar v-model="showSuccess" :timeout="3000" color="green">Transaction complete!</VSnackbar>
</template>
