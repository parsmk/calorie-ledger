<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface AuthFormProps {
		title: string;
		submitLabel: string;
		onsubmit: () => void;
		subtitle?: string;
		onback?: () => void;
		error?: string | null;
		pending?: boolean;
		children: Snippet;
		footer?: Snippet;
	}
</script>

<script lang="ts">
	const {
		title,
		submitLabel,
		onsubmit,
		subtitle,
		onback,
		error,
		pending,
		children,
		footer,
	}: AuthFormProps = $props();

	const submit = (event: SubmitEvent) => {
		event.preventDefault();
		onsubmit();
	};
</script>

<form
	onsubmit={submit}
	class="mx-auto flex w-full max-w-sm flex-col gap-5 rounded-xl border border-line bg-surface px-6 py-7 shadow-sm"
>
	<div class="flex flex-col gap-1">
		{#if subtitle}
			<p class="text-[0.7rem] tracking-[0.14em] text-muted uppercase">{subtitle}</p>
		{/if}
		<h2 class="font-serif text-2xl tracking-tight">{title}</h2>
	</div>

	<div class="flex flex-col gap-4">
		{@render children()}
	</div>

	{#if error}
		<p
			role="alert"
			class="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger outline-1 outline-danger/25"
		>
			{error}
		</p>
	{/if}

	<div class="flex gap-3">
		{#if onback}
			<button
				type="button"
				onclick={onback}
				disabled={pending}
				class="
					rounded-lg px-4 py-2 text-sm font-medium text-muted transition
					hover:bg-accent-soft hover:text-foreground
					disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent
				"
			>
				Back
			</button>
		{/if}
		<button
			type="submit"
			disabled={pending}
			class="
				grow rounded-lg border border-line px-4 py-2 text-sm font-medium transition
				hover:border-line-strong hover:bg-accent-soft
				disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-line
				disabled:hover:bg-transparent
			"
		>
			{submitLabel}
		</button>
	</div>

	{#if footer}{@render footer()}{/if}
</form>
