// Key used to persist the user's explicit theme choice in localStorage.
// Keeping it in one place avoids typo bugs across files (app.html also reads this same key).
const STORAGE_KEY = 'theme'

/**
 * ThemeManager — single source of truth for dark/light mode.
 *
 * Why a class instead of a plain store?
 * Svelte 5 $state works inside class fields, giving us reactive state with
 * co-located methods — no need for a separate writable store + exported functions.
 *
 * Why a singleton (exported instance) instead of instantiating per-component?
 * Theme is global UI state. One instance means every component that imports
 * `theme` shares the same reactive `isDark` value automatically.
 */
class ThemeManager {
	// Reactive field — any component reading `theme.isDark` re-renders when it changes.
	isDark = $state(false)

	/**
	 * Call once in the root layout's onMount.
	 *
	 * Priority order:
	 *   1. User's saved preference in localStorage  (explicit choice wins)
	 *   2. OS/browser color-scheme preference        (fallback when no choice saved)
	 *
	 * We also attach an OS change listener, but only when no saved preference exists.
	 * Reason: if the user has explicitly picked a theme we should respect that, not
	 * override it just because they switched their OS setting.
	 */
	init() {
		const saved = localStorage.getItem(STORAGE_KEY)
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

		if (saved !== null) {
			// User has previously made an explicit choice — honour it.
			this.isDark = saved === 'dark'
		} else {
			// No saved preference yet — mirror the OS setting.
			this.isDark = mediaQuery.matches

			// Keep following OS changes dynamically for as long as the user hasn't
			// saved a preference. The guard inside the listener re-checks localStorage
			// because the user may toggle (and therefore save) at any point after init.
			mediaQuery.addEventListener('change', (e) => {
				if (localStorage.getItem(STORAGE_KEY) === null) {
					this.isDark = e.matches
					this.applyTheme(this.isDark)
				}
			})
		}

		this.applyTheme(this.isDark)
	}

	/**
	 * Flip the current theme and persist the choice.
	 *
	 * Writing to localStorage here means:
	 *   - The choice survives page refreshes.
	 *   - The blocking inline script in app.html can read it before first paint,
	 *     which eliminates the flash of unstyled content (FOUC) on reload.
	 *   - The OS change listener will stop overriding the theme (see init).
	 */
	toggle() {
		this.isDark = !this.isDark
		localStorage.setItem(STORAGE_KEY, this.isDark ? 'dark' : 'light')
		this.applyTheme(this.isDark)
	}

	/**
	 * Applies the theme by toggling the `dark` class on <html>.
	 * shadcn-svelte uses `.dark` on the root element to switch its CSS variable sets,
	 * as defined by `@custom-variant dark (&:is(.dark *))` in layout.css.
	 */
	applyTheme(dark: boolean) {
		document.documentElement.classList.toggle('dark', dark)
	}
}

export const theme = new ThemeManager()
