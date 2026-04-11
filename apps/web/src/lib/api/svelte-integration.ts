import {
	authClient,
	userClient,
	businessClient,
	serviceClient,
	workingHoursClient,
	breakClient,
	timeoffClient
} from './index'

// Helper for Svelte components to access all API clients
export const useApi = () => ({
	auth: authClient,
	users: userClient,
	businesses: businessClient,
	services: serviceClient,
	workingHours: workingHoursClient,
	breaks: breakClient,
	timeoff: timeoffClient
})

// Type-safe API usage
export type ApiClient = ReturnType<typeof useApi>

// Example usage in Svelte component:
/*
<script lang="ts">
  import { useApi } from '$lib/api/svelte-integration'
  
  const api = useApi()
  
  async function handleLogin() {
    try {
      const response = await api.auth.login({
        userNameOrEmail: 'user@example.com',
        password: 'password123'
      })
      console.log('Login successful:', response)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
</script>
*/
