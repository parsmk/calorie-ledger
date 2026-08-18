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

<div class="divide-x-primary grid grid-cols-3 divide-x outline-1 outline-primary">
	<EntryCard>
		<InputField label="Date" name="date" classes="col-span-2" />

		<NumberField label="Today's Weight" name="weight">
			{#snippet rightAdornment()}kg{/snippet}
		</NumberField>
	</EntryCard>

	<EntryCard>
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
		/>
	</EntryCard>

	<EntryCard>
		<NumberField label="BMR" name="bmr" />
		<NumberField label="NEAT" name="neat" />
		<NumberField label="EAT" name="eat">
			{#snippet rightAdornment()}
				<button type="button">Add</button>
			{/snippet}
		</NumberField>
		<NumberField bind:value={tef} label="TEF" name="tef" />
		<NumberField label="Maintenance Calories" name="maintenance" classes="col-span-2" />
	</EntryCard>
</div>
