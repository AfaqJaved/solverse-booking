<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { Calendar } from '@fullcalendar/core'
	import dayGridPlugin from '@fullcalendar/daygrid'
	import timeGridPlugin from '@fullcalendar/timegrid'
	import listPlugin from '@fullcalendar/list'
	import interactionPlugin from '@fullcalendar/interaction'
	import type { CalendarOptions, EventInput } from '@fullcalendar/core'

	type Props = {
		events?: EventInput[]
		view?: string
		onEventClick?: CalendarOptions['eventClick']
		onDateClick?: CalendarOptions['dateClick']
	}

	let {
		events = [],
		view = $bindable('timeGridWeek'),
		onEventClick,
		onDateClick
	}: Props = $props()

	let el: HTMLDivElement
	let calendar: Calendar | undefined = $state()

	onMount(() => {
		calendar = new Calendar(el, {
			plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
			initialView: view,
			events,
			headerToolbar: {
				left: 'prev,next today',
				center: 'title',
				right: ''
			},
			height: '100%',
			firstDay: 1,
			nowIndicator: true,
			businessHours: {
				daysOfWeek: [1, 2, 3, 4, 5],
				startTime: '09:00',
				endTime: '18:00'
			},
			slotMinTime: '07:00:00',
			slotMaxTime: '21:00:00',
			eventClick: onEventClick,
			dateClick: onDateClick,
			eventTimeFormat: {
				hour: '2-digit',
				minute: '2-digit',
				meridiem: 'short'
			}
		})
		calendar.render()
	})

	onDestroy(() => {
		calendar?.destroy()
	})

	$effect(() => {
		if (calendar) {
			calendar.removeAllEvents()
			calendar.addEventSource(events)
		}
	})

	$effect(() => {
		if (calendar && view) {
			calendar.changeView(view)
		}
	})

</script>

<div bind:this={el} class="fc-wrapper h-full"></div>

<style>
	:global(.fc-wrapper .fc) {
		font-family: var(--font-sans, 'Inter Variable', sans-serif);
	}
	:global(.fc-wrapper .fc-toolbar-title) {
		font-size: 1.1rem;
		font-weight: 600;
	}
	:global(.fc-wrapper .fc-button-primary) {
		background-color: var(--primary) !important;
		border-color: var(--primary) !important;
		color: var(--primary-foreground) !important;
		font-size: 0.8rem;
		padding: 0.3rem 0.7rem;
		text-transform: capitalize;
		box-shadow: none !important;
		outline: none !important;
		border-radius: var(--radius-md) !important;
	}
	/* Button groups: round only the outer edges */
	:global(.fc-wrapper .fc-button-group .fc-button-primary:first-child) {
		border-radius: var(--radius-md) 0 0 var(--radius-md) !important;
	}
	:global(.fc-wrapper .fc-button-group .fc-button-primary:last-child) {
		border-radius: 0 var(--radius-md) var(--radius-md) 0 !important;
	}
	:global(.fc-wrapper .fc-button-group .fc-button-primary:not(:first-child):not(:last-child)) {
		border-radius: 0 !important;
	}
	:global(.fc-wrapper .fc-button-primary:hover) {
		background-color: color-mix(in oklch, var(--primary) 85%, black) !important;
		border-color: color-mix(in oklch, var(--primary) 85%, black) !important;
		color: var(--primary-foreground) !important;
	}
	:global(.fc-wrapper .fc-button-primary:not(:disabled):active),
	:global(.fc-wrapper .fc-button-primary:not(:disabled).fc-button-active) {
		background-color: color-mix(in oklch, var(--primary) 75%, black) !important;
		border-color: color-mix(in oklch, var(--primary) 75%, black) !important;
		color: var(--primary-foreground) !important;
		box-shadow: none !important;
	}
	:global(.fc-wrapper .fc-button-primary:focus-visible) {
		box-shadow: 0 0 0 2px var(--ring) !important;
	}
	:global(.fc-wrapper .fc-event) {
		border-radius: var(--radius-sm);
		font-size: 0.78rem;
		cursor: pointer;
	}
	/* List view panel */
	:global(.fc-wrapper .fc-list) {
		border-radius: var(--radius-lg);
		overflow: hidden;
	}
	/* Popover (more events) */
	:global(.fc-wrapper .fc-popover) {
		border-radius: var(--radius-lg) !important;
		overflow: hidden;
	}
	:global(.fc-wrapper .fc-daygrid-event) {
		white-space: nowrap;
		overflow: hidden;
	}
	:global(.fc-wrapper .fc-col-header-cell-cushion),
	:global(.fc-wrapper .fc-daygrid-day-number),
	:global(.fc-wrapper .fc-list-event-title a) {
		color: inherit;
		text-decoration: none;
	}
	/* List view */
	:global(.fc-wrapper .fc-list) {
		border-color: var(--border) !important;
	}
	:global(.fc-wrapper .fc-list-table) {
		background-color: var(--card) !important;
	}
	:global(.fc-wrapper .fc-list-day-cushion) {
		background-color: var(--muted) !important;
		color: var(--foreground) !important;
	}
	:global(.fc-wrapper .fc-list-day-text),
	:global(.fc-wrapper .fc-list-day-side-text) {
		color: var(--foreground) !important;
	}
	:global(.fc-wrapper .fc-list-event td) {
		background-color: var(--card) !important;
		color: var(--foreground) !important;
		border-color: var(--border) !important;
	}
	:global(.fc-wrapper .fc-list-event:hover td) {
		background-color: var(--accent) !important;
		color: var(--accent-foreground) !important;
	}
	:global(.fc-wrapper .fc-list-empty) {
		background-color: var(--card) !important;
		color: var(--muted-foreground) !important;
	}
</style>
