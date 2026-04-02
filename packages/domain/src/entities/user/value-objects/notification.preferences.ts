import { Schema } from 'effect'

/**
 * Controls which channels the user opts into for receiving notifications
 * such as appointment reminders, confirmations, and cancellations.
 *
 * Each channel is independently togglable:
 * - `email` — email notifications (default: true)
 * - `sms`   — SMS text messages (default: false)
 * - `push`  — mobile push notifications (default: true)
 */
export const NotificationPreferences = Schema.Struct({
  email: Schema.Boolean,
  sms: Schema.Boolean,
  push: Schema.Boolean,
})
export type NotificationPreferences = typeof NotificationPreferences.Type
