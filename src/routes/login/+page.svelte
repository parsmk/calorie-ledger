<script lang="ts">
	import { goto } from '$app/navigation';
	import { postAuth } from '$lib/auth';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import InputField from '$lib/components/ui-kit/InputField.svelte';

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
			<a href="/signup" class="text-accent transition hover:text-accent/80">Create one</a>
		</p>
	{/snippet}
</AuthForm>
