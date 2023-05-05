export default function randomAddress() {
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
