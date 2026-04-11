// Test file to verify API client usage and TypeScript types
import { useApi } from './svelte-integration'
import type { UserApi, BusinessApi, ServiceApi } from '@solverse/shared'

// Example usage patterns
const api = useApi()

// 1. Authentication examples
async function testAuthentication() {
	// Login
	const loginData: UserApi.Login.Request = {
		userNameOrEmail: 'user@example.com',
		password: 'password123'
	}

	try {
		const loginResponse = await api.auth.login(loginData)
		console.log('Login successful, token:', loginResponse.token)
	} catch (error) {
		console.error('Login failed:', error)
	}

	// Verify email
	try {
		await api.auth.verifyEmail('user-id-123')
		console.log('Email verification sent')
	} catch (error) {
		console.error('Email verification failed:', error)
	}

	// Logout
	api.auth.logout()
	console.log('Logged out')
}

// 2. User management examples
async function testUserManagement() {
	const userId = 'user-id-123'

	// Register new user
	const registerData: UserApi.Register.Request = {
		username: 'newuser',
		password: 'password123',
		name: { firstName: 'John', lastName: 'Doe' },
		email: 'john@example.com',
		role: 'businessOwner',
		timezone: 'America/New_York',
		phone: '+1234567890'
	}

	try {
		const registerResponse = await api.users.register(registerData)
		console.log('User registered with ID:', registerResponse.id)
	} catch (error) {
		console.error('Registration failed:', error)
	}

	// Get user profile
	try {
		const profile = await api.users.getProfile(userId)
		console.log('User profile:', profile)
	} catch (error) {
		console.error('Failed to get profile:', error)
	}

	// Update profile
	const updateData: UserApi.UpdateProfile.Request = {
		timezone: 'America/Los_Angeles',
		phone: '+1987654321',
		notificationPreferences: {
			email: true,
			sms: false,
			push: true
		}
	}

	try {
		await api.users.updateProfile(userId, updateData)
		console.log('Profile updated')
	} catch (error) {
		console.error('Profile update failed:', error)
	}
}

// 3. Business management examples
async function testBusinessManagement() {
	const businessId = 'business-id-123'
	const ownerId = 'owner-id-123'

	// Register new business
	const registerData: BusinessApi.Register.Request = {
		ownerId,
		name: 'My Business',
		slug: 'my-business',
		email: 'business@example.com',
		timezone: 'America/New_York',
		currency: 'USD',
		phone: '+1234567890',
		plan: 'starter'
	}

	try {
		const registerResponse = await api.businesses.register(registerData)
		console.log('Business registered with ID:', registerResponse.id)
	} catch (error) {
		console.error('Business registration failed:', error)
	}

	// Get businesses by owner
	try {
		const businesses = await api.businesses.getByOwner(ownerId)
		console.log('Owner businesses:', businesses)
	} catch (error) {
		console.error('Failed to get businesses:', error)
	}

	// Update business profile
	const updateData: BusinessApi.UpdateProfile.Request = {
		actorId: ownerId,
		name: 'Updated Business Name',
		description: 'New description',
		website: 'https://example.com',
		logoUrl: 'https://example.com/logo.png',
		phone: '+1987654321',
		timezone: 'America/Los_Angeles',
		email: 'updated@example.com',
		currency: 'EUR'
	}

	try {
		await api.businesses.updateProfile(businessId, updateData)
		console.log('Business profile updated')
	} catch (error) {
		console.error('Business update failed:', error)
	}
}

// 4. Service management examples
async function testServiceManagement() {
	const serviceId = 'service-id-123'
	const businessId = 'business-id-123'

	// Create service
	const createData: ServiceApi.Create.Request = {
		businessId,
		name: 'Haircut',
		duration: 30,
		price: 2500, // $25.00 in cents
		createdBy: 'user-id-123',
		description: 'Professional haircut service',
		bufferTime: 10,
		color: '#3b82f6',
		maxBookingsPerSlot: 2,
		status: 'active'
	}

	try {
		const createResponse = await api.services.create(createData)
		console.log('Service created with ID:', createResponse.id)
	} catch (error) {
		console.error('Service creation failed:', error)
	}

	// Get services by business
	try {
		const services = await api.services.getByBusiness(businessId)
		console.log('Business services:', services)
	} catch (error) {
		console.error('Failed to get services:', error)
	}

	// Update service
	const updateData: ServiceApi.Update.Request = {
		updatedBy: 'user-id-123',
		name: 'Premium Haircut',
		description: 'Premium haircut with styling',
		duration: 45,
		bufferTime: 15,
		price: 3500,
		color: '#8b5cf6',
		maxBookingsPerSlot: 1
	}

	try {
		await api.services.update(serviceId, updateData)
		console.log('Service updated')
	} catch (error) {
		console.error('Service update failed:', error)
	}
}

// Export test functions for manual testing
export { testAuthentication, testUserManagement, testBusinessManagement, testServiceManagement }
