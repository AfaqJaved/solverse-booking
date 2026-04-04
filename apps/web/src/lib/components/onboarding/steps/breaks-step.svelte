<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Badge } from '$lib/components/ui/badge/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import TrashIcon from '@lucide/svelte/icons/trash-2'
	import PlusIcon from '@lucide/svelte/icons/plus'
	import CoffeeIcon from '@lucide/svelte/icons/coffee'
	import type { DaySchedule, BreakFormData } from '../types.js'

	let {
		schedule,
		breaks = $bindable([])
	}: {
		schedule: DaySchedule[]
		breaks: BreakFormData[]
	} = $props()

	let openDays = $derived(schedule.filter((d) => d.isOpen))

	let addingFor = $state<string | null>(null)
	let draftLabel = $state('')
	let draftStart = $state('12:00')
	let draftEnd = $state('13:00')

	function openForm(day: string) {
		addingFor = day
		draftLabel = ''
		draftStart = '12:00'
		draftEnd = '13:00'
	}

	function confirmAdd() {
		if (!addingFor || !draftLabel.trim()) return
		breaks = [
			...breaks,
			{ id: crypto.randomUUID(), day: addingFor, label: draftLabel, startTime: draftStart, endTime: draftEnd }
		]
		addingFor = null
	}

	function removeBreak(id: string) {
		breaks = breaks.filter((b) => b.id !== id)
	}

	function breaksForDay(day: string): BreakFormData[] {
		return breaks.filter((b) => b.day === day)
	}
</script>

{#if openDays.length === 0}
	<div class="flex flex-col items-center gap-2 py-8 text-center">
		<CoffeeIcon class="size-7 text-muted-foreground" />
		<div>
			<p class="text-sm font-medium">No open days configured</p>
			<p class="text-xs text-muted-foreground">Go back and set your working hours first.</p>
		</div>
	</div>
{:else}
	<div class="space-y-3">
		{#each openDays as day, i (day.day)}
			<div>
				<!-- Day header -->
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<span class="text-sm font-medium">{day.label}</span>
						<Badge variant="secondary" class="font-mono text-xs">{day.openTime} – {day.closeTime}</Badge>
					</div>
					{#if addingFor !== day.day}
						<Button variant="outline" size="xs" type="button" onclick={() => openForm(day.day)}>
							<PlusIcon class="size-3" />
							Add Break
						</Button>
					{/if}
				</div>

				<!-- Break list -->
				<div class="mt-1.5 space-y-1">
					{#each breaksForDay(day.day) as brk (brk.id)}
						<div class="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5">
							<CoffeeIcon class="size-3.5 shrink-0 text-muted-foreground" />
							{#if brk.label}
								<span class="text-sm font-medium">{brk.label}</span>
								<span class="text-muted-foreground">·</span>
							{/if}
							<span class="flex-1 font-mono text-sm">{brk.startTime} – {brk.endTime}</span>
							<Button
								variant="ghost"
								size="icon-xs"
								type="button"
								onclick={() => removeBreak(brk.id)}
								class="text-muted-foreground hover:text-destructive"
							>
								<TrashIcon class="size-3" />
							</Button>
						</div>
					{:else}
						{#if addingFor !== day.day}
							<p class="text-xs text-muted-foreground">No breaks.</p>
						{/if}
					{/each}
				</div>

				<!-- Inline add form -->
				{#if addingFor === day.day}
					<div class="mt-1.5 space-y-2 rounded-lg border border-border bg-muted/20 p-2.5">
						<Input placeholder="Label (e.g. Lunch, Prayer)" bind:value={draftLabel} class="h-8" required />
						<div class="flex items-end gap-2">
							<div class="flex-1 space-y-1">
								<label class="text-xs font-medium text-muted-foreground">From</label>
								<Input type="time" bind:value={draftStart} class="h-8" />
							</div>
							<div class="flex-1 space-y-1">
								<label class="text-xs font-medium text-muted-foreground">To</label>
								<Input type="time" bind:value={draftEnd} class="h-8" />
							</div>
							<div class="flex gap-1.5">
								<Button type="button" size="sm" onclick={confirmAdd} disabled={!draftLabel.trim()}>Add</Button>
								<Button type="button" variant="ghost" size="sm" onclick={() => (addingFor = null)}>Cancel</Button>
							</div>
						</div>
					</div>
				{/if}

				{#if i < openDays.length - 1}
					<Separator class="mt-3" />
				{/if}
			</div>
		{/each}
	</div>
{/if}
