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
	import SparklesIcon from '@lucide/svelte/icons/sparkles'

	import * as Dialog from '$lib/components/ui/dialog/index.js'
	import { Separator } from '$lib/components/ui/separator/index.js'
	import { Badge } from '$lib/components/ui/badge/index.js'
	import { Button } from '$lib/components/ui/button/index.js'

	import OnboardingProgress from '$lib/components/onboarding/onboarding-progress.svelte'
	import BusinessStep from '$lib/components/onboarding/steps/business-step.svelte'
	import ServicesStep from '$lib/components/onboarding/steps/services-step.svelte'
	import WorkingHoursStep from '$lib/components/onboarding/steps/working-hours-step.svelte'
	import BreaksStep from '$lib/components/onboarding/steps/breaks-step.svelte'
	import CompleteStep from '$lib/components/onboarding/steps/complete-step.svelte'

	import OwnerStep from '$lib/components/onboarding/steps/owner-step.svelte'

	import type {
		StepConfig,
		OwnerFormData,
		BusinessFormData,
		ServiceFormData,
		DaySchedule,
		BreakFormData
	} from '$lib/components/onboarding/types.js'

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
			skippable: false
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

	// ── Derived ───────────────────────────────────────────────────────────────

	let step = $derived(STEPS[currentStep])
	let isFirst = $derived(currentStep === 0)
	let isLast = $derived(currentStep === STEPS.length - 1)
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
		// TODO: call API with { owner, business, services, schedule, breaks }
		console.log('Onboarding complete', { owner, business, services, schedule, breaks })
	}
</script>

<!-- Page background -->
<div
	class="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/40"
	aria-hidden="true"
></div>

<Dialog.Root open={true}>
	<Dialog.Content
		showCloseButton={false}
		class="flex max-h-[92vh] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
		onInteractOutside={(e) => e.preventDefault()}
		onEscapeKeydown={(e) => e.preventDefault()}
	>
		<!-- Branding + step counter -->
		<div class="flex shrink-0 items-center justify-between px-6 pt-5 pb-1">
			<div class="flex items-center gap-2.5">
				<div
					class="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm"
				>
					<GalleryVerticalEndIcon class="size-4" />
				</div>
				<span class="text-sm font-semibold tracking-tight">Solverse</span>
			</div>
			<Badge variant="secondary" class="text-xs font-normal tabular-nums">
				Step {currentStep + 1} of {STEPS.length}
			</Badge>
		</div>

		<!-- Step progress -->
		<div class="shrink-0 px-4">
			<OnboardingProgress steps={STEPS} {currentStep} />
		</div>

		<Separator />

		<!-- Scrollable step content -->
		<div class="flex-1 overflow-y-auto px-6 py-5">
			<div class="space-y-4">
				{#if !isLast}
					<div class="flex items-center gap-3">
						{#if step.icon}
							<div
								class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10"
							>
								<step.icon class="size-5 text-primary" />
							</div>
						{/if}
						<div>
							<h2 class="text-lg font-semibold tracking-tight">{step.description}</h2>
							{#if step.skippable}
								<p class="text-xs text-muted-foreground">
									Optional — set up later from your dashboard.
								</p>
							{/if}
						</div>
					</div>
				{/if}

				{#if currentStep === 0}
					<OwnerStep data={owner} />
				{:else if currentStep === 1}
					<BusinessStep data={business} />
				{:else if currentStep === 2}
					<WorkingHoursStep {schedule} />
				{:else if currentStep === 3}
					<BreaksStep {schedule} bind:breaks />
				{:else if currentStep === 4}
					<ServicesStep bind:services />
				{:else if currentStep === 5}
					<CompleteStep {business} {services} {schedule} {breaks} />
				{/if}
			</div>
		</div>

		<Separator />

		<!-- Footer navigation -->
		<div class="flex shrink-0 items-center justify-between px-6 py-4">
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
				{#if step.skippable && !isLast}
					<Button variant="outline" onclick={skip}>
						Skip
						<ChevronsRightIcon class="size-4" />
					</Button>
				{/if}

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
	</Dialog.Content>
</Dialog.Root>
