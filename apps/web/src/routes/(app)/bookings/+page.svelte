<script lang="ts">
	import * as Breadcrumb from '../../../lib/components/ui/breadcrumb/index.js'
	import { Separator } from '../../../lib/components/ui/separator/index.js'
	import * as Sidebar from '../../../lib/components/ui/sidebar/index.js'
	import * as Card from '../../../lib/components/ui/card/index.js'
	import * as Table from '../../../lib/components/ui/table/index.js'
	import { Badge } from '../../../lib/components/ui/badge/index.js'
	import { Button } from '../../../lib/components/ui/button/index.js'
	import CalendarPlusIcon from '@lucide/svelte/icons/calendar-plus'

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

	const stats = [
		{ label: 'Total Bookings', value: bookings.length },
		{ label: 'Upcoming', value: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length },
		{ label: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
		{ label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
	]

	const statusVariant: Record<BookingStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
		confirmed: 'default',
		pending: 'secondary',
		completed: 'outline',
		cancelled: 'destructive',
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
	}
</script>

<header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
	<div class="flex items-center gap-2 px-4">
		<Sidebar.Trigger class="-ms-1" />
		<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item class="hidden md:block">
					<Breadcrumb.Link href="/bookings">Bookings</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class="hidden md:block" />
				<Breadcrumb.Item>
					<Breadcrumb.Page>All Bookings</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<div class="flex flex-1 flex-col gap-6 p-4 pt-0">
	<!-- Page title + action -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">All Bookings</h1>
			<p class="text-sm text-muted-foreground">Manage and review all customer bookings.</p>
		</div>
		<Button>
			<CalendarPlusIcon class="mr-2 h-4 w-4" />
			New Booking
		</Button>
	</div>

	<!-- Stats cards -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat}
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Description>{stat.label}</Card.Description>
				</Card.Header>
				<Card.Content>
					<p class="text-3xl font-bold">{stat.value}</p>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<!-- Bookings table -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Bookings</Card.Title>
			<Card.Description>A full list of all customer bookings.</Card.Description>
		</Card.Header>
		<Card.Content class="p-0">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>ID</Table.Head>
						<Table.Head>Customer</Table.Head>
						<Table.Head>Service</Table.Head>
						<Table.Head>Date</Table.Head>
						<Table.Head>Time</Table.Head>
						<Table.Head>Duration</Table.Head>
						<Table.Head>Status</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each bookings as booking}
						<Table.Row>
							<Table.Cell class="font-mono text-xs text-muted-foreground">{booking.id}</Table.Cell>
							<Table.Cell class="font-medium">{booking.customer}</Table.Cell>
							<Table.Cell>{booking.service}</Table.Cell>
							<Table.Cell>{formatDate(booking.date)}</Table.Cell>
							<Table.Cell>{booking.time}</Table.Cell>
							<Table.Cell>{booking.duration} min</Table.Cell>
							<Table.Cell>
								<Badge variant={statusVariant[booking.status]}>
									{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
								</Badge>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
