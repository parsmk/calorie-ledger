<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface ComputedFieldProps {
		label: string;
		value: number;
		classes?: string;
		rightAdornment?: Snippet;
	}
</script>

<script lang="ts">
	const { label, value, classes, rightAdornment }: ComputedFieldProps = $props();
</script>

<div class={`flex items-center justify-between text-sm ${classes ?? ''}`}>
	<span class="text-muted">{label}</span>
	<span class="flex items-center gap-1.5">
		<span class="tabular-nums">{value.toLocaleString()}</span>
		{#if rightAdornment}{@render rightAdornment()}{/if}
	</span>
</div>
