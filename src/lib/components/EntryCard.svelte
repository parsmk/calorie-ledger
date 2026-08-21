<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface EntryCardProps {
		title?: string;
		children: Snippet;
	}
</script>

<script lang="ts">
	const { title, children }: EntryCardProps = $props();
</script>

<section class="flex flex-col gap-4 px-5 py-5">
	{#if title}
		<h2 class="text-[0.7rem] font-medium tracking-[0.14em] text-muted uppercase">{title}</h2>
	{/if}
	<div class="grid grid-cols-3 gap-x-3 gap-y-4">
		{@render children()}
	</div>
</section>
