<script lang="ts">
	import * as Breadcrumb from '../../../../lib/components/ui/breadcrumb/index.js'
	import { Separator } from '../../../../lib/components/ui/separator/index.js'
	import * as Sidebar from '../../../../lib/components/ui/sidebar/index.js'
	import * as Card from '../../../../lib/components/ui/card/index.js'
	import * as Table from '../../../../lib/components/ui/table/index.js'
	import { Badge } from '../../../../lib/components/ui/badge/index.js'

	type BookingStatus = 'completed' | 'cancelled'

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
		{ id: 'BK-005', customer: 'Olivia Wilson', service: 'Deep Conditioning', date: '2026-04-10', time: '13:00', duration: 45, status: 'completed' },
		{ id: 'BK-006', customer: 'Noah Martinez', service: 'Beard Trim', date: '2026-04-09', time: '15:00', duration: 30, status: 'completed' },
		{ id: 'BK-007', customer: 'Ava Thompson', service: 'Full Color', date: '2026-04-08', time: '10:00', duration: 120, status: 'cancelled' },
		{ id: 'BK-008', customer: 'Liam Garcia', service: 'Haircut & Style', date: '2026-04-07', time: '16:00', duration: 60, status: 'cancelled' },
	]

	const statusVariant: Record<BookingStatus, 'outline' | 'destructive'> = {
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
					<Breadcrumb.Page>Past</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<div class="flex flex-1 flex-col gap-6 p-4 pt-0">
	<!-- Page title -->
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Past Bookings</h1>
		<p class="text-sm text-muted-foreground">History of completed and cancelled bookings.</p>
	</div>

	<!-- Summary cards -->
	<div class="grid gap-4 sm:grid-cols-2">
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Description>Completed</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-3xl font-bold">{bookings.filter(b => b.status === 'completed').length}</p>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Description>Cancelled</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-3xl font-bold">{bookings.filter(b => b.status === 'cancelled').length}</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Past bookings table -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Past Bookings</Card.Title>
			<Card.Description>Completed and cancelled booking history.</Card.Description>
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
