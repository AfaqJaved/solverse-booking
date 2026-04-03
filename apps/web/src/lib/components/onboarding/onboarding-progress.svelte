<script lang="ts">
	import { cn } from '$lib/utils.js'
	import CheckIcon from '@lucide/svelte/icons/check'
	import type { StepConfig } from './types.js'

	let {
		steps,
		currentStep
	}: {
		steps: StepConfig[]
		currentStep: number
	} = $props()
</script>

<nav aria-label="Onboarding progress" class="w-full px-2 py-5">
	<ol class="flex items-start">
		{#each steps as step, i}
			{#if i > 0}
				<li class="relative mt-4 h-px flex-1 min-w-4" aria-hidden="true">
					<div
						class={cn(
							'h-full transition-colors duration-300',
							i <= currentStep ? 'bg-primary' : 'bg-border'
						)}
					></div>
				</li>
			{/if}
			<li class="flex shrink-0 flex-col items-center gap-1.5">
				<div
					class={cn(
						'flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300',
						i < currentStep
							? 'border-primary bg-primary text-primary-foreground'
							: i === currentStep
								? 'border-primary bg-background text-primary shadow-sm'
								: 'border-border bg-background text-muted-foreground'
					)}
					aria-current={i === currentStep ? 'step' : undefined}
				>
					{#if i < currentStep}
						<CheckIcon class="size-4" />
					{:else}
						{i + 1}
					{/if}
				</div>
				<span
					class={cn(
						'hidden max-w-[80px] text-center text-[11px] font-medium leading-tight sm:block',
						i === currentStep ? 'text-foreground' : 'text-muted-foreground'
					)}
				>
					{step.title}
				</span>
				{#if step.skippable && i > currentStep}
					<span class="hidden text-[10px] text-muted-foreground sm:block">optional</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
