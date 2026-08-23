<script module lang="ts">
	export interface SignupProps {
		/**
		 * Swaps to the login form in place. Without it the footer falls back to a link to `/login`, so
		 * the standalone route still navigates.
		 */
		onswitch?: () => void;
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { getAuth, postAuth } from '$lib/auth';
	import AuthForm from '$lib/components/auth/AuthForm.svelte';
	import InputField from '$lib/components/ui-kit/InputField.svelte';
	import NumberField from '$lib/components/ui-kit/NumberField.svelte';

	const { onswitch }: SignupProps = $props();

	const minPasswordLength = 8;
	const maxAge = 120;
	const maxHeight = 300;

	let email = $state('');
	let password = $state('');
	let confirmation = $state('');
	let age = $state(0);
	let height = $state(0);

	let step = $state<1 | 2>(1);
	let error = $state<string | null>(null);
	let pending = $state(false);

	// The credentials are settled before the details card opens, so a taken email or a mistyped
	// confirmation is reported while the field that caused it is still on screen.
	const continueToDetails = async () => {
		if (password.length < minPasswordLength) {
			error = `password must be at least ${minPasswordLength} characters`;
			return;
		}
		if (password !== confirmation) {
			error = 'passwords do not match';
			return;
		}

		pending = true;
		const result = await getAuth<{ available: boolean }>('/api/auth/signup', { email });
		pending = false;

		if (result.error !== null) {
			error = result.error;
			return;
		}
		if (!result.data.available) {
			error = 'that email is already registered';
			return;
		}

		error = null;
		step = 2;
	};

	// The credentials card stays on screen beside the details one, so reopening it for edits is
	// what closes the second card again.
	const editCredentials = () => {
		error = null;
		step = 1;
	};

	// Mirrors what the route enforces, so the common mistakes cost no round trip.
	const createAccount = async () => {
		if (!Number.isInteger(age) || age < 1 || age > maxAge) {
			error = `age must be a whole number between 1 and ${maxAge}`;
			return;
		}
		if (!Number.isInteger(height) || height < 1 || height > maxHeight) {
			error = `height must be a whole number between 1 and ${maxHeight} cm`;
			return;
		}

		pending = true;
		const result = await postAuth('/api/auth/signup', { email, password, age, height });
		pending = false;

		if (result.error !== null) {
			error = result.error;
			return;
		}

		await goto('/', { invalidateAll: true });
	};
</script>

<div class="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center">
	<AuthForm
		title="Create account"
		subtitle="Step 1 of 2"
		submitLabel={step === 1 ? 'Continue' : 'Edit'}
		onsubmit={step === 1 ? continueToDetails : editCredentials}
		error={step === 1 ? error : null}
		pending={step === 1 && pending}
	>
		<InputField
			bind:value={email}
			type="email"
			label="Email"
			name="email"
			autocomplete="email"
			placeholder="you@example.com"
			readonly={step === 2}
			required
		/>
		<InputField
			bind:value={password}
			type="password"
			label="Password"
			name="password"
			autocomplete="new-password"
			placeholder="{minPasswordLength}+ characters"
			readonly={step === 2}
			required
		/>
		<InputField
			bind:value={confirmation}
			type="password"
			label="Confirm password"
			name="confirmation"
			autocomplete="new-password"
			readonly={step === 2}
			required
		/>

		{#snippet footer()}
			<p class="text-center text-sm text-muted">
				Already have an account?
				{#if onswitch}
					<button
						type="button"
						onclick={onswitch}
						class="text-accent transition hover:text-accent/80"
					>
						Sign in
					</button>
				{:else}
					<a href="/login" class="text-accent transition hover:text-accent/80">Sign in</a>
				{/if}
			</p>
		{/snippet}
	</AuthForm>

	{#if step === 2}
		<div class="w-full max-w-sm" in:fly={{ x: -16, duration: 200 }}>
			<AuthForm
				title="About you"
				subtitle="Step 2 of 2"
				submitLabel="Create account"
				onsubmit={createAccount}
				{error}
				{pending}
			>
				<NumberField bind:value={age} label="Age" name="age">
					{#snippet rightAdornment()}
						<span class="shrink-0 text-xs text-muted">years</span>
					{/snippet}
				</NumberField>
				<NumberField bind:value={height} label="Height" name="height">
					{#snippet rightAdornment()}
						<span class="shrink-0 text-xs text-muted">cm</span>
					{/snippet}
				</NumberField>
			</AuthForm>
		</div>
	{/if}
</div>
