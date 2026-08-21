<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>calorie ledger</title>
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<header class="sticky top-0 z-10 border-b border-line bg-background/85 backdrop-blur">
		<div class="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
			<span class="size-2 shrink-0 rounded-full bg-accent"></span>
			<h1 class="font-serif text-xl tracking-tight">calorie ledger</h1>
			<p class="text-[0.7rem] tracking-[0.14em] text-muted uppercase">daily energy balance</p>
		</div>
	</header>

	<main class="mx-auto max-w-5xl px-6 py-10">
		{@render children()}
	</main>
</div>
