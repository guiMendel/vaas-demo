import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { Institution } from '@/types/Institution.interface'
import { coinsToss, randomSample } from '@/helpers/random'

export const useInstitutionsStore = defineStore('institutions', () => {
  // All institutions
  const institutions = useStorage<{ [address: Institution['address']]: Institution }>(
    'institutions',
    {}
  )

  function addInstitution(institution: Institution) {
    institutions.value[institution.address] = institution
  }

  function generateInstitution(address: Institution['address']) {
    const newInstitution: Institution = {
      name: `${capitalize(randomSample(businessWords))} ${capitalize(randomSample(businessWords))}`,
      address,
      category: capitalize(randomSample(businessCategories)),
      risk: randomSample([0, 1, 2, 3, 4, 5])
    }

    if (coinsToss()) newInstitution.name += ` ${capitalize(randomSample(businessWords))}`

    addInstitution(newInstitution)

    return newInstitution
  }

  function retrieveInstitution(address: Institution['address']) {
    if (
      institutions.value == undefined ||
      Object.keys(institutions.value).includes(address) == false
    )
      return generateInstitution(address)

    return institutions.value[address]
  }

  return { retrieveInstitution }
})

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

const businessCategories = [
  'finance',
  'fashion',
  'games',
  'gambling',
  'banks',
  'tapestry',
  'food',
  'agribusiness',
  'cripto',
  'tech',
  'art',
  'entertainment'
]

const businessWords = [
  'quick',
  'lightning',
  'steep',
  'business',
  'cash',
  'grab',
  'blue',
  'tornado',
  'bot',
  'money',
  'parts',
  'fashion',
  'games',
  'products',
  'production',
  'inc',
  'industry',
  'feast',
  'green',
  'red',
  'yellow',
  'pink',
  'orange',
  'pineapple',
  'doors',
  'snacks',
  'tasty',
  'healthy',
  'electrics',
  'brave',
  'brain',
  'smart',
  'monkey',
  'leap',
  'boot',
  'top',
  'deals',
  'mr',
  'fire'
]
