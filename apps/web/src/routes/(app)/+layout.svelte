<script lang="ts">
	import AppSidebar from '../../lib/components/app-sidebar.svelte'
	import * as Sidebar from '../../lib/components/ui/sidebar/index.js'

	let { children }: { children: import('svelte').Snippet } = $props()
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
