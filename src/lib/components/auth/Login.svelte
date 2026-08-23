<script module lang="ts">
	export interface LoginProps {
		/**
		 * Swaps to the signup form in place. Without it the footer falls back to a link to `/signup`,
		 * so the standalone route still navigates.
		 */
		onswitch?: () => void;
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { postAuth } from '$lib/auth';
	import AuthForm from '$lib/components/auth/AuthForm.svelte';
	import InputField from '$lib/components/ui-kit/InputField.svelte';

	const { onswitch }: LoginProps = $props();

	let email = $state('');
	let password = $state('');
	let error = $state<string | null>(null);
	let pending = $state(false);

	const submit = async () => {
		pending = true;
		error = (await postAuth('/api/auth/login', { email, password })).error;
		pending = false;

		if (!error) await goto('/', { invalidateAll: true });
	};
</script>

<AuthForm title="Sign in" submitLabel="Sign in" onsubmit={submit} {error} {pending}>
	<InputField
		bind:value={email}
		type="email"
		label="Email"
		name="email"
		autocomplete="email"
		placeholder="you@example.com"
		required
	/>
	<InputField
		bind:value={password}
		type="password"
		label="Password"
		name="password"
		autocomplete="current-password"
		required
	/>

	{#snippet footer()}
		<p class="text-center text-sm text-muted">
			No account yet?
			{#if onswitch}
				<button type="button" onclick={onswitch} class="text-accent transition hover:text-accent/80">
					Create one
				</button>
			{:else}
				<a href="/signup" class="text-accent transition hover:text-accent/80">Create one</a>
			{/if}
		</p>
	{/snippet}
</AuthForm>
