import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { Client, ClientParams } from '@/types/Client.interface'

export const useClientsStore = defineStore('clients', () => {
  // All clients
  const clients = useStorage<{ [id: Client['id']]: Client }>('clients', {})

  // An id generator
  const idGenerator = useStorage<number>('client-id-generator', 0)

  function addClient(client: ClientParams) {
    // Get new id
    idGenerator.value = idGenerator.value != null ? idGenerator.value + 1 : 1

    const clientId = idGenerator.value.toString()

    clients.value[clientId] = { ...client, id: clientId, balance: 0 }
  }

  function deleteClient(clientId: string) {
    delete clients.value[clientId]
  }

  function getByAddress(address: Client['address']) {
    for (const client of Object.keys(clients.value).map((key) => clients.value[key]))
      if (client.address == address) return client

    return undefined
  }

  return { clients, addClient, deleteClient, getByAddress }
})
