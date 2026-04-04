<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import EyeIcon from '@lucide/svelte/icons/eye'
	import EyeOffIcon from '@lucide/svelte/icons/eye-off'
	import type { OwnerFormData } from '../types.js'

	let { data }: { data: OwnerFormData } = $props()

	let showPassword = $state(false)
	let showConfirm = $state(false)
	let usernameManuallyEdited = $state(false)

	function handleFirstNameInput(e: Event) {
		const value = (e.target as HTMLInputElement).value
		data.firstName = value
		if (!usernameManuallyEdited) {
			data.username = value
				.toLowerCase()
				.trim()
				.replace(/[^a-z0-9_]/g, '')
		}
	}

	let passwordMismatch = $derived(
		data.confirmPassword.length > 0 && data.password !== data.confirmPassword
	)
	let passwordTooShort = $derived(data.password.length > 0 && data.password.length < 8)
</script>

<Field.Group>
	<!-- Row 1: First + Last name -->
	<div class="grid grid-cols-2 gap-3">
		<Field.Field>
			<Field.Label for="owner-first-name">First Name <span class="text-destructive">*</span></Field.Label>
			<Input
				id="owner-first-name"
				placeholder="Jane"
				value={data.firstName}
				oninput={handleFirstNameInput}
				autocomplete="given-name"
				required
			/>
		</Field.Field>
		<Field.Field>
			<Field.Label for="owner-last-name">Last Name <span class="text-destructive">*</span></Field.Label>
			<Input
				id="owner-last-name"
				placeholder="Smith"
				bind:value={data.lastName}
				autocomplete="family-name"
				required
			/>
		</Field.Field>
	</div>

	<!-- Row 2: Username + Email -->
	<div class="grid grid-cols-2 gap-3">
		<Field.Field>
			<Field.Label for="owner-username">Username <span class="text-destructive">*</span></Field.Label>
			<Input
				id="owner-username"
				placeholder="jane_smith"
				bind:value={data.username}
				oninput={() => (usernameManuallyEdited = true)}
				autocomplete="username"
				class="lowercase"
				required
			/>
		</Field.Field>
		<Field.Field>
			<Field.Label for="owner-email">Email <span class="text-destructive">*</span></Field.Label>
			<Input
				id="owner-email"
				type="email"
				placeholder="jane@example.com"
				bind:value={data.email}
				autocomplete="email"
				required
			/>
		</Field.Field>
	</div>

	<!-- Row 3: Phone -->
	<Field.Field>
		<Field.Label for="owner-phone">Phone <span class="text-muted-foreground text-xs font-normal">(optional)</span></Field.Label>
		<Input
			id="owner-phone"
			type="tel"
			placeholder="+1 555 000 0000"
			bind:value={data.phone}
			autocomplete="tel"
		/>
	</Field.Field>

	<!-- Row 4: Password + Confirm -->
	<div class="grid grid-cols-2 gap-3">
		<Field.Field>
			<Field.Label for="owner-password">Password <span class="text-destructive">*</span></Field.Label>
			<div class="relative">
				<Input
					id="owner-password"
					type={showPassword ? 'text' : 'password'}
					placeholder="Min. 8 characters"
					bind:value={data.password}
					autocomplete="new-password"
					class="pr-10"
					required
				/>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					onclick={() => (showPassword = !showPassword)}
					class="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					aria-label={showPassword ? 'Hide password' : 'Show password'}
				>
					{#if showPassword}<EyeOffIcon class="size-4" />{:else}<EyeIcon class="size-4" />{/if}
				</Button>
			</div>
			{#if passwordTooShort}
				<p class="text-xs text-destructive">Min. 8 characters.</p>
			{/if}
		</Field.Field>
		<Field.Field>
			<Field.Label for="owner-confirm-password">Confirm Password <span class="text-destructive">*</span></Field.Label>
			<div class="relative">
				<Input
					id="owner-confirm-password"
					type={showConfirm ? 'text' : 'password'}
					placeholder="Repeat password"
					bind:value={data.confirmPassword}
					autocomplete="new-password"
					class="pr-10"
					required
				/>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					onclick={() => (showConfirm = !showConfirm)}
					class="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					aria-label={showConfirm ? 'Hide password' : 'Show password'}
				>
					{#if showConfirm}<EyeOffIcon class="size-4" />{:else}<EyeIcon class="size-4" />{/if}
				</Button>
			</div>
			{#if passwordMismatch}
				<p class="text-xs text-destructive">Passwords don't match.</p>
			{/if}
		</Field.Field>
	</div>
</Field.Group>
