<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Checkbox } from '$lib/components/ui/checkbox/index.js'
	import { Badge } from '$lib/components/ui/badge/index.js'
	import { cn } from '$lib/utils.js'
	import type { DaySchedule } from '../types.js'

	let { schedule }: { schedule: DaySchedule[] } = $props()
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Working Hours</Card.Title>
		<Card.Description>
			Set the days and hours your business is open. Only open days will accept bookings.
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="space-y-2">
			{#each schedule as day (day.day)}
				<div
					class={cn(
						'flex flex-wrap items-center gap-3 rounded-lg border border-border p-3 transition-colors',
						day.isOpen ? 'bg-background' : 'bg-muted/30'
					)}
				>
					<!-- Toggle -->
					<Checkbox id="day-{day.day}" bind:checked={day.isOpen} class="shrink-0" />

					<!-- Day label -->
					<label
						for="day-{day.day}"
						class="w-24 shrink-0 cursor-pointer select-none text-sm font-medium"
					>
						{day.label}
					</label>

					{#if day.isOpen}
						<div class="flex flex-1 flex-wrap items-center gap-2">
							<Input
								type="time"
								bind:value={day.openTime}
								class="w-full max-w-[130px]"
								aria-label="Open time for {day.label}"
							/>
							<span class="shrink-0 text-xs text-muted-foreground">to</span>
							<Input
								type="time"
								bind:value={day.closeTime}
								class="w-full max-w-[130px]"
								aria-label="Close time for {day.label}"
							/>
						</div>
					{:else}
						<Badge variant="secondary" class="ml-auto">Closed</Badge>
					{/if}
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
