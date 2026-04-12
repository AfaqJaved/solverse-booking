<script lang="ts">
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end'
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right'
	import CheckIcon from '@lucide/svelte/icons/check'
	import ChevronsRightIcon from '@lucide/svelte/icons/chevrons-right'
	import UserRoundIcon from '@lucide/svelte/icons/user-round'
	import Building2Icon from '@lucide/svelte/icons/building-2'
	import Clock3Icon from '@lucide/svelte/icons/clock-3'
	import CoffeeIcon from '@lucide/svelte/icons/coffee'
	import CalendarOffIcon from '@lucide/svelte/icons/calendar-off'
	import SparklesIcon from '@lucide/svelte/icons/sparkles'
	import PartyPopperIcon from '@lucide/svelte/icons/party-popper'

	import * as Dialog from '$lib/components/ui/dialog/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Progress } from '$lib/components/ui/progress/index.js'

	import BusinessStep from '$lib/components/onboarding/steps/business-step.svelte'
	import ServicesStep from '$lib/components/onboarding/steps/services-step.svelte'
	import WorkingHoursStep from '$lib/components/onboarding/steps/working-hours-step.svelte'
	import BreaksStep from '$lib/components/onboarding/steps/breaks-step.svelte'
	import TimeOffsStep from '$lib/components/onboarding/steps/timeoffs-step.svelte'
	import CompleteStep from '$lib/components/onboarding/steps/complete-step.svelte'
	import OwnerStep from '$lib/components/onboarding/steps/owner-step.svelte'

	import type {
		StepConfig,
		OwnerFormData,
		BusinessFormData,
		ServiceFormData,
		DaySchedule,
		BreakFormData,
		TimeOffFormData
	} from '$lib/components/onboarding/types.js'
	import { goto } from '$app/navigation'
	import type { OnboardingApi } from '@solverse/shared'
	import { onboardingClient } from '$lib/api/onboarding/onboarding.client'
	import { isApiError } from '$lib/api/client/errors'
	// ── Step definitions ─────────────────────────────────────────────────────

	const STEPS: StepConfig[] = [
		{
			id: 'owner',
			title: 'Account',
			description: 'Create your account',
			skippable: false,
			icon: UserRoundIcon
		},
		{
			id: 'business',
			title: 'Business',
			description: 'Your business info',
			skippable: false,
			icon: Building2Icon
		},
		{
			id: 'working-hours',
			title: 'Hours',
			description: 'Set your hours',
			skippable: true,
			icon: Clock3Icon
		},
		{
			id: 'breaks',
			title: 'Breaks',
			description: 'Block out breaks',
			skippable: true,
			icon: CoffeeIcon
		},
		{
			id: 'timeoffs',
			title: 'Time Off',
			description: 'Schedule closures',
			skippable: true,
			icon: CalendarOffIcon
		},
		{
			id: 'services',
			title: 'Services',
			description: 'What you offer',
			skippable: true,
			icon: SparklesIcon
		},
		{
			id: 'complete',
			title: 'Done',
			description: "You're all set",
			skippable: false,
			icon: PartyPopperIcon
		}
	]

	// ── State ─────────────────────────────────────────────────────────────────

	let currentStep = $state(0)

	let owner = $state<OwnerFormData>({
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		phone: '',
		password: '',
		confirmPassword: ''
	})

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
	let timeoffs = $state<TimeOffFormData[]>([])

	let isSubmitting = $state(false)
	let submitError = $state<string | null>(null)

	// ── Derived ───────────────────────────────────────────────────────────────

	let step = $derived(STEPS[currentStep])
	let isFirst = $derived(currentStep === 0)
	let isLast = $derived(currentStep === STEPS.length - 1)
	let isSecondToLast = $derived(currentStep === STEPS.length - 2)
	let progressPercent = $derived(Math.round((currentStep / (STEPS.length - 1)) * 100))

	let canAdvance = $derived(
		currentStep === 0
			? owner.firstName.trim().length > 0 &&
					owner.lastName.trim().length > 0 &&
					owner.username.trim().length > 0 &&
					owner.email.trim().length > 0 &&
					owner.password.length >= 8 &&
					owner.password === owner.confirmPassword
			: currentStep === 1
				? business.name.trim().length > 0
				: true
	)

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

	async function finish() {
		isSubmitting = true
		submitError = null

		const payload: OnboardingApi.Register.Request = {
			owner: {
				firstName: owner.firstName,
				lastName: owner.lastName,
				username: owner.username,
				email: owner.email,
				phone: owner.phone || undefined,
				password: owner.password,
				timezone: business.timezone
			},
			business: {
				name: business.name,
				slug: business.slug,
				description: business.description || null,
				timezone: business.timezone,
				phone: business.phone || undefined,
				email: business.email,
				currency: 'USD'
			},
			workingHours: schedule.map((s) => ({
				day: s.day as OnboardingApi.Register.DaySchedule['day'],
				isOpen: s.isOpen,
				openTime: s.openTime || null,
				closeTime: s.closeTime || null
			})),
			breaks: breaks.map((b) => ({
				id: b.id,
				day: b.day as OnboardingApi.Register.DaySchedule['day'],
				startTime: b.startTime,
				endTime: b.endTime,
				label: b.label
			})),
			timeOffs: timeoffs.map((t) => ({
				label: t.label,
				allDay: t.allDay,
				cadence: t.cadence,
				startDate: t.startDate,
				endDate: t.endDate,
				startTime: t.startTime,
				endTime: t.endTime
			})),
			services: services.map((s) => ({
				id: s.id,
				name: s.name,
				duration: Number(s.duration),
				price: Number(s.price),
				description: s.description || null
			}))
		}

		try {
			await onboardingClient.register(payload)
			await goto('/home')
		} catch (err) {
			submitError = isApiError(err) ? err.message : 'Something went wrong. Please try again.'
		} finally {
			isSubmitting = false
		}
	}
</script>

<!-- Page background -->
<div
	class="fixed inset-0 bg-gradient-to-br from-primary/8 via-background to-muted/50"
	aria-hidden="true"
></div>

<Dialog.Root open={true}>
	<Dialog.Content
		showCloseButton={false}
		class="flex max-h-[92vh] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
		onInteractOutside={(e) => e.preventDefault()}
		onEscapeKeydown={(e) => e.preventDefault()}
	>
		<!-- ── Header: branding + progress ─────────────────────────────────── -->
		<div class="shrink-0 space-y-3 px-6 pt-5 pb-4">
			<!-- Branding row -->
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2.5">
					<div
						class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"
					>
						<GalleryVerticalEndIcon class="size-4" />
					</div>
					<span class="text-sm font-semibold tracking-tight">Solverse</span>
				</div>
				<span class="text-xs font-medium text-muted-foreground tabular-nums">
					{#if isLast}
						Setup complete!
					{:else}
						{progressPercent}% complete
					{/if}
				</span>
			</div>

			<!-- Progress bar -->
			<Progress value={progressPercent} class="h-1.5" />

			<!-- Step mini-dots + label -->
			<div class="flex items-center justify-between">
				<span class="text-xs text-muted-foreground">
					{#if isLast}
						All steps done
					{:else}
						Step {currentStep + 1} of {STEPS.length - 1}
					{/if}
				</span>
				<div class="flex items-center gap-1">
					{#each STEPS as _, i}
						{#if i < STEPS.length - 1}
							<div
								class="rounded-full transition-all duration-300 {i < currentStep
									? 'size-1.5 bg-primary'
									: i === currentStep
										? 'h-1.5 w-3 bg-primary/70'
										: 'size-1.5 bg-muted-foreground/25'}"
							></div>
						{/if}
					{/each}
				</div>
			</div>
		</div>

		<Separator />

		<!-- ── Scrollable content ───────────────────────────────────────────── -->
		<div class="flex-1 overflow-y-auto">
			<!-- Step banner -->
			{#if !isLast}
				<div
					class="flex items-center gap-4 border-b border-border/60 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent px-6 py-4"
				>
					{#if step.icon}
						<div
							class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 shadow-sm ring-1 ring-primary/15"
						>
							<step.icon class="size-6 text-primary" />
						</div>
					{/if}
					<div class="min-w-0">
						<h2 class="text-lg leading-tight font-semibold tracking-tight">{step.description}</h2>
						{#if step.skippable}
							<p class="mt-0.5 text-xs text-muted-foreground">
								Optional — set up later from your dashboard.
							</p>
						{:else}
							<p class="mt-0.5 text-xs text-muted-foreground">Required to continue.</p>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Form content -->
			<div class="px-6 py-5">
				{#if currentStep === 0}
					<OwnerStep data={owner} />
				{:else if currentStep === 1}
					<BusinessStep data={business} />
				{:else if currentStep === 2}
					<WorkingHoursStep {schedule} />
				{:else if currentStep === 3}
					<BreaksStep {schedule} bind:breaks />
				{:else if currentStep === 4}
					<TimeOffsStep bind:timeoffs />
				{:else if currentStep === 5}
					<ServicesStep bind:services />
				{:else if currentStep === 6}
					<CompleteStep {business} {services} {schedule} {breaks} {timeoffs} />
				{/if}
			</div>
		</div>

		<Separator />

		<!-- ── Footer navigation ────────────────────────────────────────────── -->
		<div class="shrink-0 space-y-2 px-6 py-4">
			{#if submitError}
				<p class="text-center text-sm text-destructive">{submitError}</p>
			{/if}
			<div class="flex items-center justify-between">
				<Button
					variant="ghost"
					onclick={back}
					disabled={isFirst || isSubmitting}
					class={isFirst ? 'pointer-events-none opacity-0' : ''}
				>
					<ArrowLeftIcon class="size-4" />
					Back
				</Button>

				<div class="flex items-center gap-2">
					{#if step.skippable && !isLast}
						<Button variant="outline" size="sm" onclick={skip} disabled={isSubmitting}>
							Skip
							<ChevronsRightIcon class="size-4" />
						</Button>
					{/if}

					{#if isLast}
						<Button onclick={finish} disabled={isSubmitting}>
							{isSubmitting ? 'Setting up…' : 'Go to Dashboard'}
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
		</div>
	</Dialog.Content>
</Dialog.Root>
