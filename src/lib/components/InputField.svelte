<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	export type Variant = 'bare' | 'outline';

	type Part = 'label' | 'wrapper' | 'input';

	export interface InputFieldProps {
		name: string;
		label?: string;
		value?: string;
		onchange?: ChangeEventHandler<HTMLInputElement>;
		placeholder?: string;
		readonly?: boolean;
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
</script>

<script lang="ts">
	let {
		name,
		label,
		value = $bindable(''),
		onchange,
		placeholder,
		readonly,
		variant = 'bare',
		rightAdornment,
		leftAdornment,
	}: InputFieldProps = $props();
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
			{onchange}
			bind:value
			{placeholder}
			{readonly}
			class={`
				min-w-0 grow focus:outline-none
				${variantClasses[variant].input} 
				${readonly ? 'cursor-default' : ''}
			`}
		/>
		{rightAdornment}
	</div>
</div>
