<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js'
	import * as Field from '$lib/components/ui/field/index.js'
	import * as Select from '$lib/components/ui/select/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Badge } from '$lib/components/ui/badge/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import TrashIcon from '@lucide/svelte/icons/trash-2'
	import PlusIcon from '@lucide/svelte/icons/plus'
	import ClockIcon from '@lucide/svelte/icons/clock-4'
	import type { ServiceFormData } from '../types.js'
	import { DURATION_LABELS } from '../types.js'

	let { services = $bindable([]) }: { services: ServiceFormData[] } = $props()

	const DURATIONS = [
		{ value: '15', label: '15 min' },
		{ value: '30', label: '30 min' },
		{ value: '45', label: '45 min' },
		{ value: '60', label: '1 hour' },
		{ value: '90', label: '1.5 hours' },
		{ value: '120', label: '2 hours' },
		{ value: '180', label: '3 hours' }
	]

	const CURRENCIES = ['USD', 'EUR', 'GBP', 'PKR', 'AED', 'INR', 'JPY']

	let showForm = $state(services.length === 0)

	let draft = $state<Omit<ServiceFormData, 'id'>>({
		name: '',
		duration: '60',
		price: '',
		currency: 'USD',
		description: ''
	})

	let durationLabel = $derived(DURATIONS.find((d) => d.value === draft.duration)?.label ?? '1 hour')
	let currencyLabel = $derived(draft.currency || 'Currency')

	function addService() {
		if (!draft.name.trim()) return
		services = [...services, { ...draft, id: crypto.randomUUID() }]
		draft = { name: '', duration: '60', price: '', currency: 'USD', description: '' }
		showForm = false
	}

	function removeService(id: string) {
		services = services.filter((s) => s.id !== id)
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Services</Card.Title>
		<Card.Description>
			Add the services you offer. Customers will choose one when booking.
		</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-4">
		<!-- Existing services list -->
		{#if services.length > 0}
			<div class="space-y-2">
				{#each services as service (service.id)}
					<div class="flex items-start gap-3 rounded-lg border border-border p-3">
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-1.5">
								<span class="text-sm font-medium">{service.name}</span>
								<Badge variant="secondary" class="gap-1 text-xs">
									<ClockIcon class="size-3" />
									{DURATION_LABELS[service.duration] ?? service.duration}
								</Badge>
								{#if service.price}
									<Badge variant="outline" class="text-xs">
										{service.currency}
										{service.price}
									</Badge>
								{/if}
							</div>
							{#if service.description}
								<p class="mt-0.5 truncate text-xs text-muted-foreground">{service.description}</p>
							{/if}
						</div>
						<Button
							variant="ghost"
							size="icon-sm"
							type="button"
							onclick={() => removeService(service.id)}
							class="shrink-0 text-muted-foreground hover:text-destructive"
						>
							<TrashIcon class="size-3.5" />
						</Button>
					</div>
				{/each}
			</div>

			{#if !showForm}
				<Button variant="outline" size="sm" type="button" onclick={() => (showForm = true)}>
					<PlusIcon class="size-3.5" />
					Add Another Service
				</Button>
			{/if}
		{/if}

		<!-- Add service form -->
		{#if showForm}
			{#if services.length > 0}
				<Separator />
				<p class="text-sm font-medium text-foreground">New service</p>
			{:else}
				<p class="text-sm text-muted-foreground">
					No services yet. Add your first one below, or skip this step.
				</p>
			{/if}

			<Field.Group>
				<Field.Field>
					<Field.Label for="svc-name">
						Service Name <span class="text-destructive">*</span>
					</Field.Label>
					<Input id="svc-name" placeholder="e.g. Haircut, Consultation" bind:value={draft.name} />
				</Field.Field>

				<div class="grid grid-cols-2 gap-4">
					<Field.Field>
						<Field.Label>Duration</Field.Label>
						<Select.Root bind:value={draft.duration} type="single">
							<Select.Trigger class="w-full">{durationLabel}</Select.Trigger>
							<Select.Content>
								{#each DURATIONS as d}
									<Select.Item value={d.value}>{d.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</Field.Field>

					<Field.Field>
						<Field.Label for="svc-price">Price</Field.Label>
						<div class="flex gap-1.5">
							<Select.Root bind:value={draft.currency} type="single">
								<Select.Trigger class="w-20 shrink-0">{currencyLabel}</Select.Trigger>
								<Select.Content>
									{#each CURRENCIES as c}
										<Select.Item value={c}>{c}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							<Input
								id="svc-price"
								type="number"
								min="0"
								step="0.01"
								placeholder="0.00"
								bind:value={draft.price}
							/>
						</div>
					</Field.Field>
				</div>

				<Field.Field>
					<Field.Label for="svc-desc">Description</Field.Label>
					<Input
						id="svc-desc"
						placeholder="Short description (optional)"
						bind:value={draft.description}
					/>
				</Field.Field>

				<div class="flex gap-2">
					<Button type="button" size="sm" onclick={addService} disabled={!draft.name.trim()}>
						<PlusIcon class="size-3.5" />
						Add Service
					</Button>
					{#if services.length > 0}
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onclick={() => (showForm = false)}
						>
							Cancel
						</Button>
					{/if}
				</div>
			</Field.Group>
		{/if}
	</Card.Content>
</Card.Root>
