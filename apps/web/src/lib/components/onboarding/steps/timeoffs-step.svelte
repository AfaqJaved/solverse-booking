<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Badge } from '$lib/components/ui/badge/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import { Checkbox } from '$lib/components/ui/checkbox/index.js'
	import * as Select from '$lib/components/ui/select/index.js'
	import TrashIcon from '@lucide/svelte/icons/trash-2'
	import PlusIcon from '@lucide/svelte/icons/plus'
	import CalendarIcon from '@lucide/svelte/icons/calendar'
	import type { TimeOffFormData } from '../types.js'

	let { timeoffs = $bindable([]) }: { timeoffs: TimeOffFormData[] } = $props()

	let isAdding = $state(false)
	let draftLabel = $state('')
	let draftAllDay = $state(true)
	let draftCadence = $state<TimeOffFormData['cadence']>('once')
	let draftStartDate = $state('')
	let draftEndDate = $state('')
	let draftStartTime = $state<string | null>('09:00')
	let draftEndTime = $state<string | null>('17:00')

	const CADENCE_OPTIONS = [
		{ value: 'once', label: 'Once' },
		{ value: 'daily', label: 'Daily' },
		{ value: 'weekly', label: 'Weekly' },
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'yearly', label: 'Yearly' }
	]

	function openForm() {
		isAdding = true
		draftLabel = ''
		draftAllDay = true
		draftCadence = 'once'

		// Set default dates (tomorrow to day after tomorrow)
		const tomorrow = new Date()
		tomorrow.setDate(tomorrow.getDate() + 1)
		const dayAfter = new Date(tomorrow)
		dayAfter.setDate(dayAfter.getDate() + 1)

		draftStartDate = tomorrow.toISOString().split('T')[0]
		draftEndDate = dayAfter.toISOString().split('T')[0]
		draftStartTime = '09:00'
		draftEndTime = '17:00'
	}

	function confirmAdd() {
		if (!draftLabel.trim()) return

		timeoffs = [
			...timeoffs,
			{
				id: crypto.randomUUID(),
				label: draftLabel,
				allDay: draftAllDay,
				cadence: draftCadence,
				startDate: draftStartDate,
				endDate: draftEndDate,
				startTime: draftAllDay ? null : draftStartTime,
				endTime: draftAllDay ? null : draftEndTime
			}
		]
		isAdding = false
	}

	function removeTimeOff(id: string) {
		timeoffs = timeoffs.filter((t) => t.id !== id)
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr)
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
	}

	function formatCadence(cadence: string): string {
		return cadence.charAt(0).toUpperCase() + cadence.slice(1)
	}
</script>

<div class="space-y-4">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-sm font-medium">Time Off</h3>
			<p class="text-xs text-muted-foreground">
				Block out dates when your business is closed (holidays, vacations, maintenance, etc.)
			</p>
		</div>
		{#if !isAdding}
			<Button variant="outline" size="sm" type="button" onclick={openForm}>
				<PlusIcon class="size-3" />
				Add Time Off
			</Button>
		{/if}
	</div>

	<!-- Time Off List -->
	<div class="space-y-2">
		{#each timeoffs as timeoff (timeoff.id)}
			<div class="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2">
				<CalendarIcon class="size-4 shrink-0 text-muted-foreground" />
				<div class="min-w-0 flex-1">
					<div class="flex items-center gap-2">
						<span class="truncate text-sm font-medium">{timeoff.label}</span>
						<Badge variant="secondary" class="text-xs">
							{formatCadence(timeoff.cadence)}
						</Badge>
						{#if timeoff.allDay}
							<Badge variant="outline" class="text-xs">All Day</Badge>
						{/if}
					</div>
					<div class="flex items-center gap-2 text-xs text-muted-foreground">
						<span>{formatDate(timeoff.startDate)}</span>
						<span>–</span>
						<span>{formatDate(timeoff.endDate)}</span>
						{#if !timeoff.allDay && timeoff.startTime && timeoff.endTime}
							<span>·</span>
							<span>{timeoff.startTime} – {timeoff.endTime}</span>
						{/if}
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon-xs"
					type="button"
					onclick={() => removeTimeOff(timeoff.id)}
					class="text-muted-foreground hover:text-destructive"
				>
					<TrashIcon class="size-3" />
				</Button>
			</div>
		{:else}
			{#if !isAdding}
				<div class="flex flex-col items-center gap-2 py-6 text-center">
					<CalendarIcon class="size-7 text-muted-foreground" />
					<div>
						<p class="text-sm font-medium">No time off scheduled</p>
						<p class="text-xs text-muted-foreground">
							Add holidays, vacations, or maintenance days.
						</p>
					</div>
				</div>
			{/if}
		{/each}
	</div>

	<!-- Add Form -->
	{#if isAdding}
		<div class="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
			<Input
				placeholder="Label (e.g. Christmas Holiday, Annual Maintenance)"
				bind:value={draftLabel}
				class="h-8"
				required
			/>

			<div class="flex items-center gap-2">
				<Checkbox id="all-day" bind:checked={draftAllDay} />
				<label for="all-day" class="cursor-pointer text-sm font-medium select-none">All Day</label>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<div class="space-y-1">
					<label class="text-xs font-medium text-muted-foreground">Start Date</label>
					<Input type="date" bind:value={draftStartDate} class="h-8" required />
				</div>
				<div class="space-y-1">
					<label class="text-xs font-medium text-muted-foreground">End Date</label>
					<Input type="date" bind:value={draftEndDate} class="h-8" required />
				</div>
			</div>

			{#if !draftAllDay}
				<div class="grid grid-cols-2 gap-2">
					<div class="space-y-1">
						<label class="text-xs font-medium text-muted-foreground">Start Time</label>
						<Input type="time" bind:value={draftStartTime!} class="h-8" required />
					</div>
					<div class="space-y-1">
						<label class="text-xs font-medium text-muted-foreground">End Time</label>
						<Input type="time" bind:value={draftEndTime!} class="h-8" required />
					</div>
				</div>
			{/if}

			<div class="space-y-1">
				<label class="text-xs font-medium text-muted-foreground">Repeat</label>
				<Select.Root bind:value={draftCadence} type="single">
					<Select.Trigger class="h-8 w-full">
						{formatCadence(draftCadence)}
					</Select.Trigger>
					<Select.Content>
						{#each CADENCE_OPTIONS as opt}
							<Select.Item value={opt.value}>{opt.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="flex gap-1.5 pt-1">
				<Button type="button" size="sm" onclick={confirmAdd} disabled={!draftLabel.trim()}>
					Add
				</Button>
				<Button type="button" variant="ghost" size="sm" onclick={() => (isAdding = false)}>
					Cancel
				</Button>
			</div>
		</div>
	{/if}
</div>
