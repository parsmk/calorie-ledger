<script lang="ts">
	import AuthPage from '$lib/components/auth/AuthPage.svelte';
	import CalorieLedger from '$lib/components/ledger/CalorieLedger.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

{#if data.activeSession}
	<CalorieLedger />
{:else}
	<AuthPage />
{/if}
