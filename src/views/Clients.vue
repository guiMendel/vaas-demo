<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores/clients'
import { ref } from 'vue'
import type { Client } from '@/types/Client.interface'
import { computed } from 'vue'
import { watch } from 'vue'

const clientStore = useClientsStore()

const { clients } = storeToRefs(clientStore)
const { addClient, deleteClient } = clientStore

const formatBalance = (value: number | undefined) =>
  value ? (Math.round(value * 100) / 100).toFixed(2) : '0.00'

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

// Generate random address
const getRandomAddress = () => {
  const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

  const characters = '1234567890qwertyuiopasdfghjklzxcvbnm'

  const length = randomRange(25, 34)

  let address = ''

  while (address.length < length) {
    let character = characters[randomRange(0, characters.length)]

    if (Math.random() > 0.5) character = character.toUpperCase()

    address += character
  }

  return address
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

const addressRules = [
  (value: string) => {
    if (value) return true

    return 'Address is required.'
  },
  (value: string) => {
    if (value?.length > 24 && value?.length <= 34) return true

    return 'Address must be between 25 and 34 characters long.'
  }
]

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

// Finish management
const finishManagement = () => {
  manageBalance.value = false
  balanceActionMethod.value = undefined
}
</script>

<template>
  <!-- Balance management -->

  <!-- Client delete confirmation -->
  <VDialog v-model="manageBalance">
    <VCard
      variant="elevated"
      class="px-5 pt-3 pb-7"
      :title="`${manageBalanceClient?.name ?? ''}'s Balance`"
      :subtitle="`Address ${manageBalanceClient?.address ?? ''}`"
    >
      <VCardItem>
        <!-- Balance visualization -->
        <div class="d-flex align-center justify-center my-5" style="gap: 1rem">
          <div class="d-flex flex-column align-center">
            <small style="color: gray">Balance Before</small>
            <span class="font-weight-bold">
              {{ formatBalance(manageBalanceClient?.balance) }}
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
            <VTextField label="Amount" type="number" v-model="balanceActionValue" />
          </VCol>

          <!-- Trigger action -->
          <VCol cols="12" sm="4" class="px-2">
            <VBtn block variant="tonal" style="height: 56px">Perform</VBtn>
          </VCol>
        </VRow>
      </VCardItem>

      <VCardActions class="align-self-end">
        <VBtn @click="finishManagement">Done</VBtn>
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
                    @click="editClientAddress = getRandomAddress()"
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
        Balance:
        <span class="text-overline">{{ formatBalance(client.balance) }}</span>
      </VCardItem>

      <VCardActions class="d-flex flex-wrap align-center justify-center" style="gap: 1rem">
        <VBtn class="ma-0" prepend-icon="fas fa-wallet" @click="manageBalanceClientId = client.id"
          >Manage Balance
        </VBtn>
        <VBtn class="ma-0" prepend-icon="fas fa-exchange-alt">Start Transaction </VBtn>
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