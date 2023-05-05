export const addressRules = [
  (value: string) => {
    if (value) return true

    return 'Address is required.'
  },
  (value: string) => {
    if (value?.length > 24 && value?.length <= 34) return true

    return 'Address must be between 25 and 34 characters long.'
  },
  (value: string) => {
    if (/^[a-zA-Z0-9]+$/.test(value)) return true

    return 'Address must be composed of alphanumeric values only.'
  }
]

export default function validateAddress(address: string) {
  for (const rule of addressRules) if (rule(address) !== true) return rule(address)

  return true
}
