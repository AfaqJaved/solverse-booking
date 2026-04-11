<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js'
	import { Badge } from '$lib/components/ui/badge/index.js'
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check'
	import Building2Icon from '@lucide/svelte/icons/building-2'
	import ScissorsIcon from '@lucide/svelte/icons/scissors'
	import CalendarIcon from '@lucide/svelte/icons/calendar'
	import CoffeeIcon from '@lucide/svelte/icons/coffee'
	import CalendarOffIcon from '@lucide/svelte/icons/calendar-off'
	import type {
		BusinessFormData,
		ServiceFormData,
		DaySchedule,
		BreakFormData,
		TimeOffFormData
	} from '../types.js'
	import { DURATION_LABELS } from '../types.js'

	let {
		business,
		services,
		schedule,
		breaks,
		timeoffs
	}: {
		business: BusinessFormData
		services: ServiceFormData[]
		schedule: DaySchedule[]
		breaks: BreakFormData[]
		timeoffs: TimeOffFormData[]
	} = $props()

	let openDays = $derived(schedule.filter((d) => d.isOpen))

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr)
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
	}

	function formatCadence(cadence: string): string {
		return cadence.charAt(0).toUpperCase() + cadence.slice(1)
	}
</script>

<div class="space-y-4">
	<!-- Hero card -->
	<Card.Root class="border-primary/20 bg-primary/5">
		<Card.Content class="flex flex-col items-center gap-3 py-10 text-center">
			<div class="flex size-14 items-center justify-center rounded-full bg-primary/10">
				<CircleCheckIcon class="size-8 text-primary" />
			</div>
			<div>
				<h2 class="text-xl font-bold">{business.name || 'Your business'} is ready!</h2>
				<p class="mt-1 text-sm text-muted-foreground">
					Here's a summary of what you've configured.
				</p>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Business -->
	<Card.Root>
		<Card.Header class="pb-2">
			<div class="flex items-center gap-2">
				<Building2Icon class="size-4 text-muted-foreground" />
				<Card.Title class="text-base">Business</Card.Title>
			</div>
		</Card.Header>
		<Card.Content class="space-y-1.5 pt-0">
			<div class="flex flex-wrap items-center gap-2">
				<span class="text-sm font-medium">{business.name || '—'}</span>
				{#if business.slug}
					<Badge variant="outline" class="font-mono text-xs">/{business.slug}</Badge>
				{/if}
			</div>
			{#if business.description}
				<p class="text-sm text-muted-foreground">{business.description}</p>
			{/if}
			<div class="flex flex-wrap gap-2">
				{#if business.timezone}
					<Badge variant="secondary" class="text-xs">{business.timezone}</Badge>
				{/if}
				{#if business.email}
					<Badge variant="secondary" class="text-xs">{business.email}</Badge>
				{/if}
				{#if business.phone}
					<Badge variant="secondary" class="text-xs">{business.phone}</Badge>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Services -->
	<Card.Root>
		<Card.Header class="pb-2">
			<div class="flex items-center gap-2">
				<ScissorsIcon class="size-4 text-muted-foreground" />
				<Card.Title class="text-base">Services</Card.Title>
				<Badge variant="secondary" class="ml-auto text-xs">{services.length}</Badge>
			</div>
		</Card.Header>
		<Card.Content class="pt-0">
			{#if services.length === 0}
				<p class="text-sm text-muted-foreground">No services added.</p>
			{:else}
				<div class="space-y-1.5">
					{#each services as s (s.id)}
						<div class="flex flex-wrap items-center gap-2 text-sm">
							<span class="flex-1 font-medium">{s.name}</span>
							<Badge variant="secondary" class="text-xs">
								{DURATION_LABELS[s.duration] ?? s.duration}
							</Badge>
							{#if s.price}
								<span class="text-xs text-muted-foreground">{s.currency} {s.price}</span>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	<!-- Working hours -->
	<Card.Root>
		<Card.Header class="pb-2">
			<div class="flex items-center gap-2">
				<CalendarIcon class="size-4 text-muted-foreground" />
				<Card.Title class="text-base">Working Hours</Card.Title>
				<Badge variant="secondary" class="ml-auto text-xs">{openDays.length} days</Badge>
			</div>
		</Card.Header>
		<Card.Content class="pt-0">
			{#if openDays.length === 0}
				<p class="text-sm text-muted-foreground">No working hours set.</p>
			{:else}
				<div class="space-y-1">
					{#each openDays as day (day.day)}
						{@const dayBreaks = breaks.filter((b) => b.day === day.day)}
						<div class="flex flex-wrap items-center gap-2 text-sm">
							<span class="w-24 font-medium">{day.label}</span>
							<span class="text-muted-foreground">
								{day.openTime} – {day.closeTime}
							</span>
							{#if dayBreaks.length > 0}
								<div class="flex items-center gap-1 text-xs text-muted-foreground">
									<CoffeeIcon class="size-3" />
									{dayBreaks.length}
									{dayBreaks.length === 1 ? 'break' : 'breaks'}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	<!-- Time Off -->
	<Card.Root>
		<Card.Header class="pb-2">
			<div class="flex items-center gap-2">
				<CalendarOffIcon class="size-4 text-muted-foreground" />
				<Card.Title class="text-base">Time Off</Card.Title>
				<Badge variant="secondary" class="ml-auto text-xs">{timeoffs.length}</Badge>
			</div>
		</Card.Header>
		<Card.Content class="pt-0">
			{#if timeoffs.length === 0}
				<p class="text-sm text-muted-foreground">No time off scheduled.</p>
			{:else}
				<div class="space-y-1.5">
					{#each timeoffs as t (t.id)}
						<div class="flex flex-wrap items-center gap-2 text-sm">
							<span class="flex-1 font-medium">{t.label}</span>
							<Badge variant="secondary" class="text-xs">
								{formatCadence(t.cadence)}
							</Badge>
							{#if t.allDay}
								<Badge variant="outline" class="text-xs">All Day</Badge>
							{/if}
							<div class="w-full text-xs text-muted-foreground">
								{formatDate(t.startDate)} – {formatDate(t.endDate)}
								{#if !t.allDay && t.startTime && t.endTime}
									<span> · {t.startTime} – {t.endTime}</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
