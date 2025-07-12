import { defineStore } from 'pinia'

export const useResourceStore = defineStore('resource', {
  state: () => ({
    resources: []
  }),
  actions: {
    async fetchResources() {
      const response = await import('@/assets/json/healthResources.json')
      this.resources = response.default
    }
  }
})
