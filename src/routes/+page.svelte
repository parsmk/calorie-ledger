<script lang="ts">
	import CalorieLedger from '$lib/components/CalorieLedger.svelte';
	import Login from '$lib/components/Login.svelte';
	import Signup from '$lib/components/Signup.svelte';
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
