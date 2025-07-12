// eventStore.js
import { defineStore } from 'pinia'

export const useEventStore = defineStore('event', {
  state: () => ({
    events: []
  }),
  actions: {
    async fetchEvents() {
      const res = await fetch('/api/events').then(r => r.json())
      this.events = res
    }
  }
})
