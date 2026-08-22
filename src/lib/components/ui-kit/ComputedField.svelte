<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type Variant = 'row' | 'inline';

	type Part = 'wrapper' | 'value';

	export interface ComputedFieldProps {
		label: string;
		value: number;
		signed?: boolean;
		variant?: Variant;
		classes?: string;
		rightAdornment?: Snippet;
	}

	const variantClasses: Record<Variant, Record<Part, string>> = {
		row: {
			wrapper: 'justify-between',
			value: '',
		},
		inline: {
			wrapper: 'gap-2',
			value: 'font-medium',
		},
	};
</script>

<script lang="ts">
	const {
		label,
		value,
		signed,
		variant = 'row',
		classes,
		rightAdornment,
	}: ComputedFieldProps = $props();
</script>

<div class={`flex items-center text-sm ${variantClasses[variant].wrapper} ${classes ?? ''}`}>
	<span class="text-muted">{label}</span>
	<span class="flex items-center gap-1.5">
		<span class={`tabular-nums ${variantClasses[variant].value}`}>
			{signed && value > 0 ? '+' : ''}{value.toLocaleString()}
		</span>
		{#if rightAdornment}{@render rightAdornment()}{/if}
	</span>
</div>
