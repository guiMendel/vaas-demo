export function randomRangeInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function randomSample(array: any[] | string) {
  return array[randomRangeInt(0, array.length)]
}

export function coinsToss(probability = 0.5) {
  return Math.random() < probability
}

export function randomAddress() {
  const characters = '1234567890qwertyuiopasdfghjklzxcvbnm'

  const length = randomRangeInt(25, 34)

  let address = ''

  while (address.length < length) {
    let character = randomSample(characters)

    if (coinsToss()) character = character.toUpperCase()

    address += character
  }

  return address
}
