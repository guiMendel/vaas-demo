<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores/clients'
import { ref } from 'vue'
import type { Client } from '@/types/Client.interface'
import { computed } from 'vue'
import { watch } from 'vue'
import { useMobileSettingsStore } from '@/stores/mobileSettings'
import formatBalance from '@/helpers/formatBalance'
import { randomAddress } from '@/helpers/random'
import { addressRules } from '@/helpers/validateAddress'
import { useRouter } from 'vue-router'

const clientStore = useClientsStore()

const { clients } = storeToRefs(clientStore)
const { addClient, deleteClient } = clientStore

const { isMobile } = storeToRefs(useMobileSettingsStore())

// === CLIENT EDITING

// Whether the editor is for a new user
const creatingNewUser = ref(false)

// Whether to show client editor
const showEditor = ref(false)

// Edited client name
const editClientName = ref('')

// Edited client address
const editClientAddress = ref('')

// Whether form is valid
const formValid = ref(false)

// Client being edited
const editClientId = ref<string | null>(null)

// Client with pending delete confirmation
const pendingDeleteClientId = ref<string | null>(null)
const pendingDelete = computed({
  get: () => pendingDeleteClientId.value != null,
  set: (value) => (value ? null : (pendingDeleteClientId.value = null))
})
const deletableClient = computed(() =>
  pendingDeleteClientId.value ? clients.value[pendingDeleteClientId.value] : null
)

// Commits creation of new client
const commitClient = () => {
  // If creating
  if (creatingNewUser.value)
    addClient({ name: editClientName.value, address: editClientAddress.value })
  // Otherwise, save edits
  else if (editClientId.value != null) {
    clients.value[editClientId.value].name = editClientName.value
    clients.value[editClientId.value].address = editClientAddress.value
  }

  showEditor.value = false
}

// Starts editing this client
const editClient = (client: Client) => {
  showEditor.value = true
  creatingNewUser.value = false
  editClientId.value = client.id

  setTimeout(() => {
    editClientName.value = client.name
    editClientAddress.value = client.address
  }, 50)
}

// Erase fields when closing editor
watch(showEditor, (show) => {
  if (show == false) {
    editClientName.value = ''
    editClientAddress.value = ''
  }
})

const commitDelete = () => {
  if (pendingDeleteClientId.value) deleteClient(pendingDeleteClientId.value)
  pendingDeleteClientId.value = null
}

const nameRules = [
  (value: string) => {
    if (value) return true

    return 'Name is required.'
  },
  (value: string) => {
    if (value?.length > 3) return true

    return 'Name must be more than 3 characters.'
  }
]

const router = useRouter()

const startTransactionFor = (clientId: string) =>
  router.push({ name: 'transaction', params: { selectedClientId: clientId } })

// === BALANCE MANAGEMENT

// Client with balance management open
const manageBalanceClientId = ref<string | null>(null)
const manageBalance = computed({
  get: () => manageBalanceClientId.value != null,
  set: (value) => (value ? null : (manageBalanceClientId.value = null))
})
const manageBalanceClient = computed(() =>
  manageBalanceClientId.value ? clients.value[manageBalanceClientId.value] : null
)

// Selected balance action method
const balanceActionMethod = ref<undefined | 'Withdraw' | 'Deposit'>(undefined)

// Value of balance action
const balanceActionValue = ref(0)
const setBalance = (rawValue: string) => {
  const value = parseFloat(rawValue)

  console.log(value, balanceActionValue.value)

  if (isNaN(value) || value < 0) return
  balanceActionValue.value = value
}

// Result of current action
const actionResult = computed(() => {
  if (balanceActionMethod.value == undefined || manageBalanceClient.value == undefined)
    return manageBalanceClient.value?.balance

  return balanceActionMethod.value == 'Withdraw'
    ? manageBalanceClient.value.balance - balanceActionValue.value
    : manageBalanceClient.value.balance + balanceActionValue.value
})

// Commits balance action
const commitBalanceAction = () => {
  if (actionResult.value != undefined && manageBalanceClient.value != undefined)
    manageBalanceClient.value.balance = actionResult.value

  balanceActionValue.value = 0
}

// Unset method when closing dialogue
watch(manageBalance, (manage) => {
  if (manage == false) {
    balanceActionMethod.value = undefined
    balanceActionValue.value = 0
  }
})

const resultStyle = computed(() => {
  if (
    balanceActionMethod.value == undefined ||
    manageBalanceClient.value == undefined ||
    actionResult.value == undefined ||
    manageBalanceClient.value.balance == actionResult.value
  )
    return {}

  return actionResult.value > manageBalanceClient.value.balance
    ? { color: 'limeGreen' }
    : { color: 'fireBrick' }
})
</script>

<template>
  <!-- Balance management -->
  <VDialog v-model="manageBalance">
    <VCard
      variant="elevated"
      class="px-5 pt-3 pb-7"
      :title="`${manageBalanceClient?.name ?? ''}'s Balance`"
      :subtitle="`Address ${manageBalanceClient?.address ?? ''}`"
    >
      <VCardItem>
        <!-- Balance visualization -->
        <div
          class="d-flex align-end justify-center mt-4 mb-8 flex-wrap"
          :style="{ gap: '1rem', fontSize: isMobile ? 'inherit' : '1.2rem' }"
        >
          <!-- Balance before -->
          <div class="d-flex flex-column align-center">
            <small style="color: gray">Balance Before</small>
            <span class="font-weight-bold">
              {{ formatBalance(manageBalanceClient?.balance) }}
            </span>
          </div>

          <!-- Transition arrow -->
          <VIcon icon="fas fa-long-arrow-alt-right" />

          <!-- Balance after -->
          <div class="d-flex flex-column align-center">
            <small style="color: gray">Balance After</small>
            <span class="font-weight-bold" :style="resultStyle">
              {{ formatBalance(actionResult) }}
            </span>
          </div>
        </div>

        <!-- Action triggering -->
        <VRow no-gutters>
          <!-- Action method -->
          <VCol cols="12" sm="4" class="px-2">
            <VSelect
              label="Method"
              v-model="balanceActionMethod"
              :items="['Deposit', 'Withdraw']"
            />
          </VCol>

          <!-- Action value -->
          <VCol cols="12" sm="4" class="px-2">
            <VTextField
              label="Amount"
              type="number"
              min="0"
              :model-value="balanceActionValue"
              @update:model-value="setBalance"
            />
          </VCol>

          <!-- Trigger action -->
          <VCol cols="12" sm="4" class="px-2">
            <VBtn
              block
              variant="tonal"
              style="height: 56px"
              :disabled="
                balanceActionMethod == undefined ||
                balanceActionValue <= 0 ||
                (actionResult != undefined && actionResult < 0)
              "
              @click="commitBalanceAction"
              >Perform</VBtn
            >
          </VCol>
        </VRow>
      </VCardItem>

      <VCardActions class="align-self-end">
        <VBtn @click="manageBalance = false">Done</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Client delete confirmation -->
  <VDialog v-model="pendingDelete">
    <VCard
      variant="elevated"
      class="px-5 pt-3 pb-7 mx-auto"
      style="width: max-content; max-width: 100%"
    >
      <VCardTitle style="max-width: 100%" class="text-wrap">
        Delete client {{ deletableClient?.name ?? '' }}?
      </VCardTitle>
      <VCardSubtitle style="max-width: 100%"> This cannot be undone </VCardSubtitle>

      <VCardActions class="align-self-end">
        <VBtn color="red-darken-4" prepend-icon="fas fa-trash-alt" @click="commitDelete"
          >Delete</VBtn
        >
        <VBtn @click="pendingDelete = false">Cancel</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Client editor -->
  <VDialog v-model="showEditor" class="d-flex align-center justify-center">
    <VCard
      variant="elevated"
      class="px-5 pt-3 pb-7"
      :title="creatingNewUser ? 'New Client' : 'Edit Client'"
    >
      <VCardItem>
        <VForm v-model="formValid" style="gap: 1rem" class="d-flex flex-column">
          <VTextField v-model="editClientName" :rules="nameRules" label="Name" required />
          <VTextField
            v-model="editClientAddress"
            :rules="addressRules"
            label="Blockchain Address"
            required
          >
            <template v-slot:append-inner>
              <VTooltip text="Generate random address" location="bottom">
                <template v-slot:activator="{ props }">
                  <VBtn
                    icon="fas fa-dice"
                    v-bind="props"
                    variant="text"
                    class="d-flex align-center justify-center mt-n3 pr-2 pb-1"
                    @click="editClientAddress = randomAddress()"
                  />
                </template>
              </VTooltip> </template
          ></VTextField>
        </VForm>
      </VCardItem>

      <VCardActions class="align-self-end">
        <VBtn @click="commitClient" :disabled="formValid != true">Save</VBtn>
        <VBtn @click="showEditor = false">Cancel</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Client Index -->
  <VList class="pa-10 d-flex align-center flex-column" style="gap: 2rem">
    <!-- New client button -->
    <VBtn prepend-icon="fas fa-plus" variant="text" @click="showEditor = creatingNewUser = true">
      Register Client
    </VBtn>

    <!-- Show clients -->
    <VCard v-for="client in clients" :key="client.id" class="w-100">
      <div class="mb-4 mt-2 d-flex align-center justify-space-between flex-wrap w-100">
        <!-- Client's heading -->
        <div style="max-width: 100%">
          <VCardTitle>{{ client.name }}</VCardTitle>
          <VCardSubtitle class="mt-n3">{{ client.address }}</VCardSubtitle>
        </div>

        <!-- Client management actions -->
        <div class="mx-4">
          <!-- Edit client -->
          <VBtn
            size="small"
            variant="text"
            class="ma-0"
            icon="fas fa-pen"
            @click="editClient(client)"
            color="grey-darken-2"
          ></VBtn>
          <!-- Delete client -->
          <VBtn
            size="small"
            variant="text"
            color="red-darken-4"
            class="ma-0"
            icon="fas fa-trash-alt"
            @click="pendingDeleteClientId = client.id"
          ></VBtn>
        </div>
      </div>

      <VCardItem>
        <span class="mr-2" style="color: gray">Balance:</span>
        <span class="text-overline font-weight-bold">{{ formatBalance(client.balance) }}</span>
      </VCardItem>

      <VCardActions class="d-flex flex-wrap align-center justify-center" style="gap: 1rem">
        <VBtn
          class="ma-0"
          prepend-icon="fas fa-wallet"
          color="grey-darken-2"
          @click="manageBalanceClientId = client.id"
          >Manage Balance
        </VBtn>
        <VBtn class="ma-0" color="grey-darken-2" prepend-icon="fas fa-exchange-alt" @click="startTransactionFor(client.id)"
          >Start Transaction
        </VBtn>
      </VCardActions>
    </VCard>

    <!-- When no clients -->
    <VAlert
      v-if="Object.keys(clients).length == 0"
      type="warning"
      title="No clients registered yet"
      text="Try adding clients through the above button 'Register Client'"
      variant="tonal"
      class="px-7"
    />
  </VList>
</template>
