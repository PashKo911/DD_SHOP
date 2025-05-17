import { ref } from 'vue'
import apiClient from '@/api/axiosConfig'
import apiEndpoints from '@/api/apiEndpoints'
import { useGeneralStore } from '../general'

export default function getStoreTemplate(entity) {
  const generalStore = useGeneralStore()
  const { generalApiOperation } = generalStore

  const itemsList = ref([])
  const currentItem = ref(null)

  const endpoints = apiEndpoints[entity]

  const loadItemsList = async () => {
    itemsList.value = await generalApiOperation({
      operation: async () => {
        const response = await apiClient.get(endpoints.getAll())
        itemsList.value = response.data
        return response.data
      }
    })
  }

  const loadItemById = async (itemId) => {
    currentItem.value = await generalApiOperation({
      operation: async () => {
        const response = await apiClient.get(endpoints.getById(itemId))
        return response.data
      }
    })
    return currentItem.value
  }

  const addItem = async (itemData) => {
    const newItem = await generalApiOperation({
      operation: async () => {
        const response = await apiClient.post(endpoints.create(), itemData)
        return response.data
      }
    })
    // itemsList.value.push(newItem)
    return newItem
  }

  const updateItem = async (id, data) => {
    await generalApiOperation({
      operation: async () => {
        const response = await apiClient.put(endpoints.update(id), data)
        const index = itemsList.value.findIndex((item) => item.id === id)
        if (index !== -1) itemsList.value[index] = { ...itemsList.value[index], ...data }
        if (currentItem.value?.id === id) currentItem.value = { ...currentItem.value, ...data }
        return response.data
      }
    })
  }

  const deleteItem = async (itemId) => {
    await generalApiOperation({
      operation: async () => {
        const response = await apiClient.delete(endpoints.delete(itemId))

        itemsList.value = itemsList.value.filter((item) => item.id !== itemId)

        return response.data
      }
    })
  }

  return {
    itemsList,
    currentItem,
    loadItemsList,
    loadItemById,
    addItem,
    updateItem,
    deleteItem
  }
}
