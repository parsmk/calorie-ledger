<script lang="ts">
	import { goto } from '$app/navigation';
	import { postAuth } from '$lib/auth';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import InputField from '$lib/components/ui-kit/InputField.svelte';
	import NumberField from '$lib/components/ui-kit/NumberField.svelte';

	const minPasswordLength = 8;
	const maxAge = 120;

	let email = $state('');
	let password = $state('');
	let confirmation = $state('');
	let age = $state(0);
	let error = $state<string | null>(null);
	let pending = $state(false);

	// Mirrors what the route enforces, so the common mistakes cost no round trip.
	const validate = () => {
		if (password.length < minPasswordLength) {
			return `password must be at least ${minPasswordLength} characters`;
		}
		if (password !== confirmation) return 'passwords do not match';
		if (!Number.isInteger(age) || age < 1 || age > maxAge) {
			return `age must be a whole number between 1 and ${maxAge}`;
		}

		return null;
	};

	const submit = async () => {
		error = validate();
		if (error) return;

		pending = true;
		error = await postAuth('/api/auth/signup', { email, password, age });
		pending = false;

		if (!error) await goto('/', { invalidateAll: true });
	};
</script>

<AuthForm title="Create account" submitLabel="Create account" onsubmit={submit} {error} {pending}>
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
		autocomplete="new-password"
		placeholder="{minPasswordLength}+ characters"
		required
	/>
	<InputField
		bind:value={confirmation}
		type="password"
		label="Confirm password"
		name="confirmation"
		autocomplete="new-password"
		required
	/>
	<NumberField bind:value={age} label="Age" name="age">
		{#snippet rightAdornment()}
			<span class="shrink-0 text-xs text-muted">years</span>
		{/snippet}
	</NumberField>

	{#snippet footer()}
		<p class="text-center text-sm text-muted">
			Already have an account?
			<a href="/login" class="text-accent transition hover:text-accent/80">Sign in</a>
		</p>
	{/snippet}
</AuthForm>
