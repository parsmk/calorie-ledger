<script lang="ts">
	import InputField from '$lib/components/InputField.svelte';
	import NumberField from '$lib/components/NumberField.svelte';

	let proteinGrams = $state(0);
	let proteinCals = $derived(proteinGrams * 4);
	let carbGrams = $state(0);
	let carbCals = $derived(carbGrams * 4);
	let fatGrams = $state(0);
	let fatCals = $derived(fatGrams * 9);

	let calories = $derived(proteinCals + carbCals + fatCals);
	let tef = $derived(proteinCals * 0.25 + carbCals * 0.075 + fatCals * 0.015);
</script>

<table
	class="
        table-auto border-collapse border
        [&_td]:border-y-1
        [&_th]:border-y-1 [&_th]:pl-2 [&_th]:text-left
    "
>
	<thead>
		<tr>
			<th>Date</th>
			<th>Weight</th>
			<th>Calories</th>
			<th>Protein</th>
			<th>Carbs</th>
			<th>Fat</th>
			<th>TEF</th>
			<th>NEAT</th>
			<th>EAT</th>
			<th>BMR</th>
			<th>Maintenance</th>
			<th>Balance</th>
			<th>Protein %</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><InputField name="date" placeholder="date" /></td>
			<td><NumberField name="weight" placeholder="weight" /></td>
			<td><NumberField bind:value={calories} readonly name="calories" placeholder="calories" /></td>
			<td><NumberField bind:value={proteinGrams} name="protein" placeholder="protein" /></td>
			<td><NumberField bind:value={carbGrams} name="carbs" placeholder="carbs" /></td>
			<td><NumberField bind:value={fatGrams} name="fats" placeholder="fats" /></td>
			<td><NumberField bind:value={tef} readonly name="tef" placeholder="TEF" /></td>
			<td><NumberField name="neat" placeholder="NEAT" /></td>
			<td><NumberField name="eat" placeholder="EAT" /></td>
			<td><NumberField name="bmr" placeholder="BMR" /></td>
			<td><NumberField name="maintenance" placeholder="Maintenance" /></td>
			<td><NumberField name="balance" placeholder="Balance" /></td>
			<td><NumberField name="proteinPercent" placeholder="Protein %" /></td>
		</tr>
	</tbody>
</table>
