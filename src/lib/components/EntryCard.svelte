<script module lang="ts">
	import type { Snippet } from 'svelte';

	interface EntryCardProps {
		children: Snippet;
	}
</script>

<script lang="ts">
	const { children }: EntryCardProps = $props();
</script>

<div class="grid grid-cols-3 gap-2 px-2 py-3">
	{@render children()}
</div>
