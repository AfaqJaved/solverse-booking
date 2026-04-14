<script lang="ts">
	import * as Breadcrumb from '../../../lib/components/ui/breadcrumb/index.js'
	import { Separator } from '../../../lib/components/ui/separator/index.js'
	import * as Sidebar from '../../../lib/components/ui/sidebar/index.js'
	import * as Card from '../../../lib/components/ui/card/index.js'
	import { Button } from '../../../lib/components/ui/button/index.js'
	import * as DropdownMenu from '../../../lib/components/ui/dropdown-menu/index.js'
	import FullCalendar from '../../../lib/components/full-calendar.svelte'
	import CalendarPlusIcon from '@lucide/svelte/icons/calendar-plus'
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid'
	import Columns3Icon from '@lucide/svelte/icons/columns-3'
	import SquareIcon from '@lucide/svelte/icons/square'
	import ListIcon from '@lucide/svelte/icons/list'
	import Grid3x3Icon from '@lucide/svelte/icons/grid-3x3'
	import type { Component } from 'svelte'
	import type { EventInput } from '@fullcalendar/core'

	type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed'

	type Booking = {
		id: string
		customer: string
		service: string
		date: string
		time: string
		duration: number
		status: BookingStatus
	}

	const bookings: Booking[] = [
		{ id: 'BK-001', customer: 'Sarah Johnson', service: 'Haircut & Style', date: '2026-04-15', time: '10:00', duration: 60, status: 'confirmed' },
		{ id: 'BK-002', customer: 'Mark Williams', service: 'Beard Trim', date: '2026-04-15', time: '11:30', duration: 30, status: 'confirmed' },
		{ id: 'BK-003', customer: 'Emma Davis', service: 'Full Color', date: '2026-04-16', time: '09:00', duration: 120, status: 'pending' },
		{ id: 'BK-004', customer: 'James Brown', service: 'Haircut & Style', date: '2026-04-16', time: '14:00', duration: 60, status: 'pending' },
		{ id: 'BK-005', customer: 'Olivia Wilson', service: 'Deep Conditioning', date: '2026-04-10', time: '13:00', duration: 45, status: 'completed' },
		{ id: 'BK-006', customer: 'Noah Martinez', service: 'Beard Trim', date: '2026-04-09', time: '15:00', duration: 30, status: 'completed' },
		{ id: 'BK-007', customer: 'Ava Thompson', service: 'Full Color', date: '2026-04-08', time: '10:00', duration: 120, status: 'cancelled' },
		{ id: 'BK-008', customer: 'Liam Garcia', service: 'Haircut & Style', date: '2026-04-07', time: '16:00', duration: 60, status: 'cancelled' },
	]

	const statusColors: Record<BookingStatus, string> = {
		confirmed: '#22c55e',
		pending:   '#f59e0b',
		completed: '#6b7280',
		cancelled: '#ef4444',
	}

	const calendarEvents: EventInput[] = bookings.map((b) => ({
		id: b.id,
		title: `${b.customer} — ${b.service}`,
		start: `${b.date}T${b.time}`,
		end: (() => {
			const [h, m] = b.time.split(':').map(Number)
			const total = h * 60 + m + b.duration
			return `${b.date}T${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
		})(),
		backgroundColor: statusColors[b.status],
		borderColor: statusColors[b.status],
	}))

	const views: { value: string; label: string; shortcut: string; icon: Component }[] = [
		{ value: 'timeGridDay',  label: 'Day',   shortcut: 'D', icon: SquareIcon },
		{ value: 'timeGridWeek', label: 'Week',  shortcut: 'W', icon: Columns3Icon },
		{ value: 'dayGridMonth', label: 'Month', shortcut: 'M', icon: LayoutGridIcon },
		{ value: 'listWeek',     label: 'List',  shortcut: 'L', icon: ListIcon },
	]

	let currentView = $state('timeGridWeek')
</script>

<header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
	<div class="flex items-center gap-2 px-4">
		<Sidebar.Trigger class="-ms-1" />
		<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Page>Calendar</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<div class="flex flex-1 flex-col gap-6 p-4 pt-0 min-h-0">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">All Bookings</h1>
			<p class="text-sm text-muted-foreground">Manage and review all customer bookings.</p>
		</div>
		<div class="flex items-center gap-2">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" size="icon" {...props}>
							<Grid3x3Icon class="h-4 w-4" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-36">
					{#each views as v}
						<DropdownMenu.Item
							onclick={() => (currentView = v.value)}
							class="flex items-center gap-2"
						>
							<v.icon class="h-4 w-4 shrink-0" />
							<span class="flex-1">{v.label}</span>
							<DropdownMenu.Shortcut>{v.shortcut}</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<Button>
				<CalendarPlusIcon class="mr-2 h-4 w-4" />
				New Booking
			</Button>
		</div>
	</div>

	<div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
		{#each Object.entries(statusColors) as [status, color]}
			<span class="flex items-center gap-1.5">
				<span class="inline-block h-3 w-3 rounded-full" style="background:{color}"></span>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		{/each}
	</div>

	<Card.Root class="flex flex-1 flex-col min-h-0">
		<Card.Content class="flex-1 min-h-0 p-4">
			<FullCalendar events={calendarEvents} bind:view={currentView} />
		</Card.Content>
	</Card.Root>
</div>
