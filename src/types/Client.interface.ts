export interface ClientParams {
  name: string
  address: string
}

export interface Client extends ClientParams {
  id: string
  balance: number
}
