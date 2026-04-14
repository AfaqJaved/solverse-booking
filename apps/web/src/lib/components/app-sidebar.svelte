<script lang="ts" module>
	import BriefcaseIcon from '@lucide/svelte/icons/briefcase'
	import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check'
	import ClockIcon from '@lucide/svelte/icons/clock'
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link'
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end'
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard'
	import RocketIcon from '@lucide/svelte/icons/rocket'
	import Settings2Icon from '@lucide/svelte/icons/settings-2'
	import UsersIcon from '@lucide/svelte/icons/users'

	const data = {
		user: {
			name: 'Business Owner',
			email: 'owner@example.com',
			avatar: ''
		},
		teams: [
			{
				name: 'My Business',
				logo: GalleryVerticalEndIcon,
				plan: 'Starter'
			}
		],
		navMain: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: LayoutDashboardIcon,
				isActive: true,
				items: [
					{ title: 'Overview', url: '/dashboard' },
					{ title: 'Analytics', url: '/dashboard/analytics' }
				]
			},
			{
				title: 'Bookings',
				url: '/bookings',
				icon: CalendarCheckIcon,
				items: [
					{ title: 'Upcoming', url: '/bookings/upcoming' },
					{ title: 'Past', url: '/bookings/past' },
					{ title: 'All Bookings', url: '/bookings' }
				]
			},
			{
				title: 'Services',
				url: '/services',
				icon: BriefcaseIcon,
				items: [
					{ title: 'All Services', url: '/services' },
					{ title: 'Add Service', url: '/services/new' }
				]
			},
			{
				title: 'Schedule',
				url: '/schedule',
				icon: ClockIcon,
				items: [
					{ title: 'Working Hours', url: '/schedule/working-hours' },
					{ title: 'Breaks', url: '/schedule/breaks' },
					{ title: 'Time Off', url: '/schedule/time-off' }
				]
			},
			{
				title: 'Team',
				url: '/team',
				icon: UsersIcon,
				items: [
					{ title: 'Members', url: '/team/members' },
					{ title: 'Roles & Permissions', url: '/team/roles' }
				]
			},
			{
				title: 'Settings',
				url: '/settings',
				icon: Settings2Icon,
				items: [
					{ title: 'Business Profile', url: '/settings/business' },
					{ title: 'Notifications', url: '/settings/notifications' },
					{ title: 'Billing', url: '/settings/billing' }
				]
			}
		],
		projects: [
			{
				name: 'Booking Page',
				url: '/book',
				icon: ExternalLinkIcon
			},
			{
				name: 'Onboarding',
				url: '/onboarding',
				icon: RocketIcon
			}
		]
	}
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte'
	import NavProjects from './nav-projects.svelte'
	import NavUser from './nav-user.svelte'
	import TeamSwitcher from './team-switcher.svelte'
	import * as Sidebar from '$lib/components/ui/sidebar/index.js'
	import type { ComponentProps } from 'svelte'

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props()
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavProjects projects={data.projects} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
