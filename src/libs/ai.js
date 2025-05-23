import {createOpenRouter} from '@openrouter/ai-sdk-provider'

export const  openrouter = createOpenRouter({
    apiKey:import.meta.env.VITE_API_KEY_OPEN_ROUTER
})