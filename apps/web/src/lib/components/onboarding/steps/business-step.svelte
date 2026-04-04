<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js'
	import * as Select from '$lib/components/ui/select/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import type { BusinessFormData } from '../types.js'

	let { data }: { data: BusinessFormData } = $props()

	const TIMEZONES = [
		{ value: 'UTC', label: 'UTC' },
		{ value: 'America/New_York', label: 'Eastern Time (ET)' },
		{ value: 'America/Chicago', label: 'Central Time (CT)' },
		{ value: 'America/Denver', label: 'Mountain Time (MT)' },
		{ value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
		{ value: 'Europe/London', label: 'London (GMT)' },
		{ value: 'Europe/Paris', label: 'Central European (CET)' },
		{ value: 'Europe/Berlin', label: 'Berlin (CET)' },
		{ value: 'Asia/Karachi', label: 'Pakistan (PKT)' },
		{ value: 'Asia/Dubai', label: 'Gulf Standard (GST)' },
		{ value: 'Asia/Kolkata', label: 'India (IST)' },
		{ value: 'Asia/Tokyo', label: 'Japan (JST)' },
		{ value: 'Asia/Singapore', label: 'Singapore (SGT)' },
		{ value: 'Australia/Sydney', label: 'Sydney (AET)' }
	]

	let slugManuallyEdited = $state(false)

	function handleNameInput(e: Event) {
		const name = (e.target as HTMLInputElement).value
		data.name = name
		if (!slugManuallyEdited) {
			data.slug = name
				.toLowerCase()
				.trim()
				.replace(/[^a-z0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-')
		}
	}

	let selectedTimezoneLabel = $derived(
		TIMEZONES.find((t) => t.value === data.timezone)?.label ?? 'Select timezone'
	)
</script>

<Field.Group>
	<!-- Row 1: Name + Booking URL -->
	<div class="grid grid-cols-2 gap-3">
		<Field.Field>
			<Field.Label for="business-name">Business Name <span class="text-destructive">*</span></Field.Label>
			<Input
				id="business-name"
				placeholder="Sunrise Barbershop"
				value={data.name}
				oninput={handleNameInput}
				required
			/>
		</Field.Field>
		<Field.Field>
			<Field.Label for="business-slug">Booking URL</Field.Label>
			<div class="flex items-center gap-1">
				<span class="shrink-0 text-sm text-muted-foreground">solverse.app/</span>
				<Input
					id="business-slug"
					placeholder="sunrise-barbershop"
					bind:value={data.slug}
					oninput={() => (slugManuallyEdited = true)}
					class="lowercase"
				/>
			</div>
		</Field.Field>
	</div>

	<!-- Row 2: Description -->
	<Field.Field>
		<Field.Label for="business-description">Description <span class="text-muted-foreground text-xs font-normal">(optional)</span></Field.Label>
		<textarea
			id="business-description"
			placeholder="Briefly describe your business..."
			rows={2}
			bind:value={data.description}
			class="w-full min-w-0 resize-none rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
		></textarea>
	</Field.Field>

	<!-- Row 3: Phone + Email -->
	<div class="grid grid-cols-2 gap-3">
		<Field.Field>
			<Field.Label for="business-phone">Phone</Field.Label>
			<Input id="business-phone" type="tel" placeholder="+1 555 000 0000" bind:value={data.phone} />
		</Field.Field>
		<Field.Field>
			<Field.Label for="business-email">Email</Field.Label>
			<Input id="business-email" type="email" placeholder="hello@business.com" bind:value={data.email} />
		</Field.Field>
	</div>

	<!-- Row 4: Timezone -->
	<Field.Field>
		<Field.Label>Timezone</Field.Label>
		<Select.Root bind:value={data.timezone} type="single">
			<Select.Trigger class="w-full">{selectedTimezoneLabel}</Select.Trigger>
			<Select.Content>
				{#each TIMEZONES as tz}
					<Select.Item value={tz.value}>{tz.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</Field.Field>
</Field.Group>
