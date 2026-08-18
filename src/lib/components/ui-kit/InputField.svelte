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
		classes?: string;
		rightAdornment?: Snippet;
		leftAdornment?: Snippet;
	}

	const variantClasses: Record<Variant, Record<Part, string>> = {
		bare: {
			label: '',
			wrapper: 'outline-primary/0 focus-within:outline-primary',
			input: '',
		},
		outline: {
			label: '',
			wrapper: 'outline-primary focus-within:shadow-sm',
			input: '',
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
		variant = 'outline',
		classes,
		rightAdornment,
		leftAdornment,
	}: InputFieldProps = $props();
</script>

<div class={classes}>
	{#if label}
		<p class={`${variantClasses[variant].label}`}>{label}</p>
	{/if}
	<div
		class={`group flex items-center p-2 outline-1 transition-all duration-300 ${variantClasses[variant].wrapper}`}
	>
		{#if leftAdornment}{@render leftAdornment()}{/if}
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
		{#if rightAdornment}{@render rightAdornment()}{/if}
	</div>
</div>
