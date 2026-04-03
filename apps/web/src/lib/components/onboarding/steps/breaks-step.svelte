<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js'
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
	let draftStart = $state('12:00')
	let draftEnd = $state('13:00')

	function openForm(day: string) {
		addingFor = day
		draftStart = '12:00'
		draftEnd = '13:00'
	}

	function confirmAdd() {
		if (!addingFor) return
		breaks = [
			...breaks,
			{ id: crypto.randomUUID(), day: addingFor, startTime: draftStart, endTime: draftEnd }
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

<Card.Root>
	<Card.Header>
		<Card.Title>Breaks</Card.Title>
		<Card.Description>
			Add breaks within working hours (e.g. lunch). Customers cannot book during these windows.
		</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if openDays.length === 0}
			<div class="flex flex-col items-center gap-3 py-10 text-center">
				<CoffeeIcon class="size-8 text-muted-foreground" />
				<div>
					<p class="text-sm font-medium">No open days configured</p>
					<p class="mt-0.5 text-xs text-muted-foreground">
						Go back and set your working hours first.
					</p>
				</div>
			</div>
		{:else}
			<div class="space-y-5">
				{#each openDays as day, i (day.day)}
					<div>
						<!-- Day header -->
						<div class="mb-2 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<span class="text-sm font-medium">{day.label}</span>
								<Badge variant="secondary" class="font-mono text-xs">
									{day.openTime} – {day.closeTime}
								</Badge>
							</div>
							{#if addingFor !== day.day}
								<Button
									variant="outline"
									size="xs"
									type="button"
									onclick={() => openForm(day.day)}
								>
									<PlusIcon class="size-3" />
									Add Break
								</Button>
							{/if}
						</div>

						<!-- Break list -->
						{#each breaksForDay(day.day) as brk (brk.id)}
							<div
								class="mb-1.5 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2"
							>
								<CoffeeIcon class="size-3.5 shrink-0 text-muted-foreground" />
								<span class="flex-1 font-mono text-sm">
									{brk.startTime} – {brk.endTime}
								</span>
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
								<p class="text-xs text-muted-foreground">No breaks for this day.</p>
							{/if}
						{/each}

						<!-- Inline add form -->
						{#if addingFor === day.day}
							<div
								class="mt-2 flex flex-wrap items-end gap-2 rounded-lg border border-border bg-muted/20 p-3"
							>
								<div class="min-w-[110px] flex-1 space-y-1">
									<label class="text-xs font-medium text-muted-foreground">From</label>
									<Input type="time" bind:value={draftStart} />
								</div>
								<div class="min-w-[110px] flex-1 space-y-1">
									<label class="text-xs font-medium text-muted-foreground">To</label>
									<Input type="time" bind:value={draftEnd} />
								</div>
								<div class="flex gap-2">
									<Button type="button" size="sm" onclick={confirmAdd}>Add</Button>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onclick={() => (addingFor = null)}
									>
										Cancel
									</Button>
								</div>
							</div>
						{/if}

						{#if i < openDays.length - 1}
							<Separator class="mt-4" />
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
