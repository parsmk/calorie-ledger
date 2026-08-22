<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	export type Variant = 'bare' | 'outline';

	type Part = 'wrapper' | 'input';

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
			wrapper: 'outline-transparent hover:bg-accent-soft focus-within:bg-surface focus-within:outline-accent',
			input: '',
		},
		outline: {
			wrapper: 'outline-line hover:outline-line-strong focus-within:outline-2 focus-within:outline-accent',
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
		<label for={name} class="mb-1.5 block text-xs text-muted">{label}</label>
	{/if}
	<div
		class={`
			group flex items-center gap-1.5 rounded-md px-2.5 py-2 outline-1 transition
			${variantClasses[variant].wrapper}
		`}
	>
		{#if leftAdornment}{@render leftAdornment()}{/if}
		<input
			id={name}
			type="text"
			{name}
			{onchange}
			bind:value
			{placeholder}
			{readonly}
			class={`
				min-w-0 grow bg-transparent text-sm tabular-nums placeholder:text-muted/60 focus:outline-none
				${variantClasses[variant].input}
				${readonly ? 'cursor-default text-muted' : ''}
			`}
		/>
		{#if rightAdornment}{@render rightAdornment()}{/if}
	</div>
</div>
