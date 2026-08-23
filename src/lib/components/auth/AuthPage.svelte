<script lang="ts">
	import Login from './Login.svelte';
	import Signup from './Signup.svelte';

	let signup = $state(false);
</script>

{#if signup}
	<Signup>
		{#snippet footer()}
			<p class="text-center text-sm text-muted">
				Already have an account?
				<button
					type="button"
					onclick={() => (signup = false)}
					class="text-accent transition hover:text-accent/80"
				>
					Sign in
				</button>
			</p>
		{/snippet}
	</Signup>
{:else}
	<Login>
		{#snippet footer()}
			<p class="text-center text-sm text-muted">
				No account yet?
				<button
					type="button"
					onclick={() => (signup = true)}
					class="text-accent transition hover:text-accent/80"
				>
					Create one
				</button>
			</p>
		{/snippet}
	</Login>
{/if}
