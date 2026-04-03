export interface BusinessFormData {
	name: string
	slug: string
	description: string
	timezone: string
	phone: string
	email: string
}

export interface ServiceFormData {
	id: string
	name: string
	duration: string
	price: string
	currency: string
	description: string
}

export interface DaySchedule {
	day: string
	label: string
	isOpen: boolean
	openTime: string
	closeTime: string
}

export interface BreakFormData {
	id: string
	day: string
	startTime: string
	endTime: string
}

export interface StepConfig {
	id: string
	title: string
	description: string
	skippable: boolean
}

export const DURATION_LABELS: Record<string, string> = {
	'15': '15 min',
	'30': '30 min',
	'45': '45 min',
	'60': '1 hour',
	'90': '1.5 hours',
	'120': '2 hours',
	'180': '3 hours'
}
