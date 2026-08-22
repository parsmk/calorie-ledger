<script lang="ts">
	import EntryCard from '$lib/components/EntryCard.svelte';
	import ComputedField from '$lib/components/ui-kit/ComputedField.svelte';
	import InputField from '$lib/components/ui-kit/InputField.svelte';
	import NumberField from '$lib/components/ui-kit/NumberField.svelte';

	let date = $state('21 Aug');
	let weight = $state(0);
	let height = $state(185);

	let proteinGrams = $state(0);
	let proteinCals = $derived(proteinGrams * 4);
	let carbGrams = $state(0);
	let carbCals = $derived(carbGrams * 4);
	let fatGrams = $state(0);
	let fatCals = $derived(fatGrams * 9);

	let calories = $derived(proteinCals + carbCals + fatCals);
	let tef = $derived(proteinCals * 0.25 + carbCals * 0.075 + fatCals * 0.015);

	let neat = $state(0);
	let eat = $state(0);
	let bmr = $state(0);
	let maintenance = $derived(bmr + Math.round(tef) + neat + eat);
	let balance = $derived(calories - maintenance);
</script>

<div class="flex flex-col gap-6">
	<h2 class="font-serif text-2xl tracking-tight">New entry</h2>

	<div class="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
		<div class="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
			<EntryCard title="Today">
				<InputField bind:value={date} label="Date" name="date" classes="col-span-2" />

				<NumberField bind:value={weight} label="Weight" name="weight">
					{#snippet rightAdornment()}
						<span class="shrink-0 text-xs text-muted">kg</span>
					{/snippet}
				</NumberField>
			</EntryCard>

			<EntryCard title="Intake">
				<NumberField bind:value={proteinGrams} label="Protein" name="protein">
					{#snippet rightAdornment()}
						<span class="shrink-0 text-xs text-muted">g</span>
					{/snippet}
				</NumberField>
				<NumberField bind:value={carbGrams} label="Carbs" name="carbs">
					{#snippet rightAdornment()}
						<span class="shrink-0 text-xs text-muted">g</span>
					{/snippet}
				</NumberField>
				<NumberField bind:value={fatGrams} label="Fats" name="fats">
					{#snippet rightAdornment()}
						<span class="shrink-0 text-xs text-muted">g</span>
					{/snippet}
				</NumberField>

				<InputField
					value={calories.toLocaleString()}
					label="Calories consumed"
					name="calories"
					readonly
					classes="col-span-full"
				>
					{#snippet rightAdornment()}
						<span class="shrink-0 text-xs text-muted">auto</span>
					{/snippet}
				</InputField>
			</EntryCard>

			<EntryCard title="Expenditure">
				<div class="col-span-full grid grid-cols-2 gap-3">
					<NumberField bind:value={neat} label="NEAT" name="neat">
						{#snippet rightAdornment()}
							<span class="shrink-0 text-xs text-muted">kcal</span>
							<button
								type="button"
								aria-label="Add NEAT"
								class="shrink-0 text-sm font-medium text-accent transition hover:text-accent/80"
							>
								+
							</button>
						{/snippet}
					</NumberField>

					<NumberField bind:value={eat} label="EAT" name="eat">
						{#snippet rightAdornment()}
							<span class="shrink-0 text-xs text-muted">kcal</span>
							<button
								type="button"
								aria-label="Add EAT"
								class="shrink-0 text-sm font-medium text-accent transition hover:text-accent/80"
							>
								+
							</button>
						{/snippet}
					</NumberField>
				</div>

				<div
					class="col-span-full flex flex-col gap-2 rounded-lg bg-background px-4 py-3 outline-1 outline-line"
				>
					<ComputedField label="BMR" value={bmr} />
					<ComputedField label="TEF" value={Math.round(tef)} />
					<ComputedField label="Maintenance" value={maintenance} />
				</div>
			</EntryCard>
		</div>

		<div class="flex items-center justify-between border-t border-line px-5 py-4">
			<div class="flex items-center gap-2 text-sm">
				<span class="text-muted">Balance</span>
				<span class="font-medium tabular-nums {balance < 0 ? 'text-accent' : 'text-foreground'}">
					{balance > 0 ? '+' : ''}{balance.toLocaleString()}
				</span>
			</div>
			<button
				type="button"
				class="rounded-lg border border-line px-4 py-2 text-sm font-medium transition hover:border-line-strong hover:bg-accent-soft"
			>
				Log entry
			</button>
		</div>
	</div>
</div>
