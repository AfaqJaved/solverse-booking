<script lang="ts">
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end'
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right'
	import CheckIcon from '@lucide/svelte/icons/check'
	import ChevronsRightIcon from '@lucide/svelte/icons/chevrons-right'

	import OnboardingProgress from '$lib/components/onboarding/onboarding-progress.svelte'
	import BusinessStep from '$lib/components/onboarding/steps/business-step.svelte'
	import ServicesStep from '$lib/components/onboarding/steps/services-step.svelte'
	import WorkingHoursStep from '$lib/components/onboarding/steps/working-hours-step.svelte'
	import BreaksStep from '$lib/components/onboarding/steps/breaks-step.svelte'
	import CompleteStep from '$lib/components/onboarding/steps/complete-step.svelte'

	import { Button } from '$lib/components/ui/button/index.js'

	import type {
		StepConfig,
		BusinessFormData,
		ServiceFormData,
		DaySchedule,
		BreakFormData
	} from '$lib/components/onboarding/types.js'

	// ── Step definitions ─────────────────────────────────────────────────────
	// To add a new step: append to this array and handle the new id in the
	// {#if currentStep === N} block below.

	const STEPS: StepConfig[] = [
		{
			id: 'business',
			title: 'Business',
			description: 'Tell us about your business',
			skippable: false
		},
		{
			id: 'working-hours',
			title: 'Hours',
			description: 'Set your availability',
			skippable: true
		},
		{
			id: 'breaks',
			title: 'Breaks',
			description: 'Add breaks in your schedule',
			skippable: true
		},
		{
			id: 'services',
			title: 'Services',
			description: 'Add the services you offer',
			skippable: true
		},
		{
			id: 'complete',
			title: 'Done',
			description: "You're all set",
			skippable: false
		}
	]

	// ── State ─────────────────────────────────────────────────────────────────

	let currentStep = $state(0)

	let business = $state<BusinessFormData>({
		name: '',
		slug: '',
		description: '',
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		phone: '',
		email: ''
	})

	let services = $state<ServiceFormData[]>([])

	let schedule = $state<DaySchedule[]>([
		{ day: 'monday', label: 'Monday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
		{ day: 'tuesday', label: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
		{ day: 'wednesday', label: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
		{ day: 'thursday', label: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
		{ day: 'friday', label: 'Friday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
		{ day: 'saturday', label: 'Saturday', isOpen: false, openTime: '10:00', closeTime: '14:00' },
		{ day: 'sunday', label: 'Sunday', isOpen: false, openTime: '10:00', closeTime: '14:00' }
	])

	let breaks = $state<BreakFormData[]>([])

	// ── Derived ───────────────────────────────────────────────────────────────

	let step = $derived(STEPS[currentStep])
	let isFirst = $derived(currentStep === 0)
	let isLast = $derived(currentStep === STEPS.length - 1)
	let canAdvance = $derived(currentStep !== 0 || business.name.trim().length > 0)
	let isSecondToLast = $derived(currentStep === STEPS.length - 2)

	// ── Navigation ────────────────────────────────────────────────────────────

	function next() {
		if (!isLast) currentStep++
	}

	function back() {
		if (!isFirst) currentStep--
	}

	function skip() {
		if (step.skippable && !isLast) currentStep++
	}

	function finish() {
		// TODO: call API with { business, services, schedule, breaks }
		console.log('Onboarding complete', { business, services, schedule, breaks })
	}
</script>

<div class="flex min-h-svh flex-col bg-background">
	<!-- Header -->
	<header class="shrink-0 border-b border-border px-6 py-4">
		<div class="mx-auto flex max-w-2xl items-center justify-between">
			<a href="/" class="flex items-center gap-2 font-medium">
				<div
					class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
				>
					<GalleryVerticalEndIcon class="size-4" />
				</div>
				Solverse
			</a>
			<span class="text-sm text-muted-foreground">
				Step {currentStep + 1} of {STEPS.length}
			</span>
		</div>
	</header>

	<!-- Progress indicator -->
	<div class="shrink-0 border-b border-border bg-muted/20 px-6">
		<div class="mx-auto max-w-2xl">
			<OnboardingProgress steps={STEPS} {currentStep} />
		</div>
	</div>

	<!-- Step content -->
	<main class="flex-1 overflow-y-auto px-6 py-8">
		<div class="mx-auto max-w-2xl space-y-5">
			<!-- Step heading (hidden on the final step since CompleteStep has its own hero) -->
			{#if !isLast}
				<div>
					<h1 class="text-2xl font-bold tracking-tight">{step.description}</h1>
					{#if step.skippable}
						<p class="mt-1 text-sm text-muted-foreground">
							This step is optional — you can set it up later from your dashboard.
						</p>
					{/if}
				</div>
			{/if}

			<!-- Step components -->
			{#if currentStep === 0}
				<BusinessStep data={business} />
			{:else if currentStep === 1}
				<WorkingHoursStep {schedule} />
			{:else if currentStep === 2}
				<BreaksStep {schedule} bind:breaks />
			{:else if currentStep === 3}
				<ServicesStep bind:services />
			{:else if currentStep === 4}
				<CompleteStep {business} {services} {schedule} {breaks} />
			{/if}
		</div>
	</main>

	<!-- Footer navigation -->
	<footer
		class="sticky bottom-0 shrink-0 border-t border-border bg-background/90 px-6 py-4 backdrop-blur-sm"
	>
		<div class="mx-auto flex max-w-2xl items-center justify-between gap-3">
			<!-- Back -->
			<Button
				variant="ghost"
				onclick={back}
				disabled={isFirst}
				class={isFirst ? 'pointer-events-none opacity-0' : ''}
			>
				<ArrowLeftIcon class="size-4" />
				Back
			</Button>

			<div class="flex items-center gap-2">
				<!-- Skip -->
				{#if step.skippable && !isLast}
					<Button variant="outline" onclick={skip}>
						Skip
						<ChevronsRightIcon class="size-4" />
					</Button>
				{/if}

				<!-- Continue / Finish / Dashboard -->
				{#if isLast}
					<Button onclick={finish} href="/home">
						Go to Dashboard
						<CheckIcon class="size-4" />
					</Button>
				{:else}
					<Button onclick={next} disabled={!canAdvance}>
						{isSecondToLast ? 'Finish Setup' : 'Continue'}
						<ArrowRightIcon class="size-4" />
					</Button>
				{/if}
			</div>
		</div>
	</footer>
</div>
