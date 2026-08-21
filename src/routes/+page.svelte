<script lang="ts">
	import EntryCard from '$lib/components/EntryCard.svelte';
	import InputField from '$lib/components/ui-kit/InputField.svelte';
	import NumberField from '$lib/components/ui-kit/NumberField.svelte';

	let proteinGrams = $state(0);
	let proteinCals = $derived(proteinGrams * 4);
	let carbGrams = $state(0);
	let carbCals = $derived(carbGrams * 4);
	let fatGrams = $state(0);
	let fatCals = $derived(fatGrams * 9);

	let calories = $derived(proteinCals + carbCals + fatCals);
	let tef = $derived(proteinCals * 0.25 + carbCals * 0.075 + fatCals * 0.015);
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-1">
		<h2 class="font-serif text-2xl tracking-tight">New entry</h2>
		<p class="text-sm text-muted">
			Log today's weight, what you ate, and what you burned. Calories and TEF are worked out for you.
		</p>
	</div>

	<div class="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
		<div class="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
			<EntryCard title="Today">
				<InputField label="Date" name="date" classes="col-span-2" />

				<NumberField label="Weight" name="weight">
					{#snippet rightAdornment()}kg{/snippet}
				</NumberField>
			</EntryCard>

			<EntryCard title="Intake">
				<NumberField bind:value={proteinGrams} label="Protein" name="protein">
					{#snippet rightAdornment()}g{/snippet}
				</NumberField>

				<NumberField bind:value={carbGrams} label="Carbs" name="carbs">
					{#snippet rightAdornment()}g{/snippet}
				</NumberField>

				<NumberField bind:value={fatGrams} label="Fats" name="fats">
					{#snippet rightAdornment()}g{/snippet}
				</NumberField>

				<NumberField
					bind:value={calories}
					label="Calories Consumed"
					name="calories"
					classes="col-span-full"
				>
					{#snippet rightAdornment()}kcal{/snippet}
				</NumberField>
			</EntryCard>

			<EntryCard title="Expenditure">
				<NumberField label="BMR" name="bmr" />
				<NumberField label="NEAT" name="neat" />

				<NumberField label="EAT" name="eat">
					{#snippet rightAdornment()}
						<button
							type="button"
							class="
								rounded-sm px-1.5 py-0.5 text-[0.65rem] font-medium tracking-wide
								text-accent uppercase transition hover:bg-accent-soft
							"
						>
							Add
						</button>
					{/snippet}
				</NumberField>

				<NumberField bind:value={tef} label="TEF" name="tef" />

				<NumberField label="Maintenance Calories" name="maintenance" classes="col-span-2">
					{#snippet rightAdornment()}kcal{/snippet}
				</NumberField>
			</EntryCard>
		</div>
	</div>
</div>
