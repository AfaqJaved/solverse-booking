<script lang="ts">
	import { cn } from '$lib/utils.js'
	import type { HTMLAttributes } from 'svelte/elements'

	let {
		value = 0,
		max = 100,
		class: className,
		...rest
	}: HTMLAttributes<HTMLDivElement> & {
		value?: number
		max?: number
	} = $props()
	
	let ref: HTMLDivElement | undefined = $state()
</script>

<div
	class={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
	role="progressbar"
	aria-valuemin="0"
	aria-valuemax={max}
	aria-valuenow={value}
	bind:this={ref}
	{...rest}
>
	<div
		class="h-full w-full flex-1 bg-primary transition-all duration-300"
		style={`transform: translateX(-${100 - value}%);`}
	></div>
</div>