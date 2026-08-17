<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	type Variant = 'bare' | 'outline';

	type Part = 'label' | 'wrapper' | 'input';

	interface Props {
		name: string;
		label?: string;
		value?: string;
		onchange?: ChangeEventHandler<HTMLInputElement>;
		placeholder?: string;
		variant?: Variant;
		rightAdornment?: Snippet;
		leftAdornment?: Snippet;
	}

	const variantClasses: Record<Variant, Record<Part, string>> = {
		bare: {
			label: '',
			wrapper: 'outline-1 outline-primary/0 focus-within:outline-primary',
			input: 'p-2',
		},
		outline: {
			label: '',
			wrapper: 'focus-within:shadow-sm',
			input: 'outline-1 outline-primary',
		},
	};

	const {
		name,
		label,
		value,
		onchange,
		placeholder,
		variant = 'bare',
		rightAdornment,
		leftAdornment,
	}: Props = $props();
</script>

<div>
	{#if label}
		<p class={`${variantClasses[variant].label}`}>{label}</p>
	{/if}
	<div class={`group flex transition ${variantClasses[variant].wrapper}`}>
		{leftAdornment}
		<input
			type="text"
			{name}
			{value}
			{onchange}
			{placeholder}
			class={`min-w-0 grow focus:outline-none ${variantClasses[variant].input}`}
		/>
		{rightAdornment}
	</div>
</div>
