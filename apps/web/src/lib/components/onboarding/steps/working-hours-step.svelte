<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js'
	import { Checkbox } from '$lib/components/ui/checkbox/index.js'
	import { Badge } from '$lib/components/ui/badge/index.js'
	import { cn } from '$lib/utils.js'
	import type { DaySchedule } from '../types.js'

	let { schedule }: { schedule: DaySchedule[] } = $props()
</script>

<div class="space-y-1.5">
	{#each schedule as day (day.day)}
		<div
			class={cn(
				'flex items-center gap-3 rounded-lg border border-border px-3 py-2 transition-colors',
				day.isOpen ? 'bg-background' : 'bg-muted/30'
			)}
		>
			<Checkbox id="day-{day.day}" bind:checked={day.isOpen} class="shrink-0" />

			<label for="day-{day.day}" class="w-24 shrink-0 cursor-pointer select-none text-sm font-medium">
				{day.label}
			</label>

			{#if day.isOpen}
				<div class="flex flex-1 items-center gap-2">
					<Input
						type="time"
						bind:value={day.openTime}
						class="h-8 w-[120px]"
						aria-label="Open time for {day.label}"
					/>
					<span class="shrink-0 text-xs text-muted-foreground">–</span>
					<Input
						type="time"
						bind:value={day.closeTime}
						class="h-8 w-[120px]"
						aria-label="Close time for {day.label}"
					/>
				</div>
			{:else}
				<Badge variant="secondary" class="ml-auto text-xs">Closed</Badge>
			{/if}
		</div>
	{/each}
</div>
