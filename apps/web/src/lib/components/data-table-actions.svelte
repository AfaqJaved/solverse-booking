<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { MoreVertical as DotsVerticalIcon } from '@lucide/svelte'
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="flex size-8 text-muted-foreground data-[state=open]:bg-muted">
		{#snippet child({ props })}
			<Button variant="ghost" size="icon" {...props}>
				<DotsVerticalIcon />
				<span class="sr-only">Open menu</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-32">
		<DropdownMenu.Item>Edit</DropdownMenu.Item>
		<DropdownMenu.Item>Make a copy</DropdownMenu.Item>
		<DropdownMenu.Item>Favorite</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item variant="destructive">Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
