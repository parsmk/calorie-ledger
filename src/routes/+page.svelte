<script lang="ts">
	import CalorieLedger from '$lib/components/ledger/CalorieLedger.svelte';
	import Login from '$lib/components/auth/Login.svelte';
	import Signup from '$lib/components/auth/Signup.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let signup = $state(false);
</script>

{#if data.activeSession}
	<CalorieLedger />
{:else if signup}
	<Signup onswitch={() => (signup = false)} />
{:else}
	<Login onswitch={() => (signup = true)} />
{/if}
