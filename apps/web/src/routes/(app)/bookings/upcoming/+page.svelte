<script lang="ts">
	import * as Breadcrumb from '../../../../lib/components/ui/breadcrumb/index.js'
	import { Separator } from '../../../../lib/components/ui/separator/index.js'
	import * as Sidebar from '../../../../lib/components/ui/sidebar/index.js'
	import * as Card from '../../../../lib/components/ui/card/index.js'
	import * as Table from '../../../../lib/components/ui/table/index.js'
	import { Badge } from '../../../../lib/components/ui/badge/index.js'
	import { Button } from '../../../../lib/components/ui/button/index.js'
	import CalendarPlusIcon from '@lucide/svelte/icons/calendar-plus'

	type BookingStatus = 'confirmed' | 'pending'

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
	]

	const statusVariant: Record<BookingStatus, 'default' | 'secondary'> = {
		confirmed: 'default',
		pending: 'secondary',
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
					<Breadcrumb.Page>Upcoming</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<div class="flex flex-1 flex-col gap-6 p-4 pt-0">
	<!-- Page title + action -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Upcoming Bookings</h1>
			<p class="text-sm text-muted-foreground">Confirmed and pending bookings scheduled ahead.</p>
		</div>
		<Button>
			<CalendarPlusIcon class="mr-2 h-4 w-4" />
			New Booking
		</Button>
	</div>

	<!-- Summary cards -->
	<div class="grid gap-4 sm:grid-cols-2">
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Description>Confirmed</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-3xl font-bold">{bookings.filter(b => b.status === 'confirmed').length}</p>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Description>Pending Approval</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-3xl font-bold">{bookings.filter(b => b.status === 'pending').length}</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Upcoming bookings table -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Upcoming Bookings</Card.Title>
			<Card.Description>All confirmed and pending bookings.</Card.Description>
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
