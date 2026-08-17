<script>
	import InputField from '$lib/components/InputField.svelte';
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
			<td><InputField name="weight" placeholder="weight" /></td>
			<td><InputField name="calories" placeholder="calories" /></td>
			<td><InputField name="protein" placeholder="protein" /></td>
			<td><InputField name="carbs" placeholder="carbs" /></td>
			<td><InputField name="fats" placeholder="fats" /></td>
			<td><InputField name="tef" placeholder="TEF" /></td>
			<td><InputField name="neat" placeholder="NEAT" /></td>
			<td><InputField name="eat" placeholder="EAT" /></td>
			<td><InputField name="bmr" placeholder="BMR" /></td>
			<td><InputField name="maintenance" placeholder="Maintenance" /></td>
			<td><InputField name="balance" placeholder="Balance" /></td>
			<td><InputField name="proteinPercent" placeholder="Protein %" /></td>
		</tr>
	</tbody>
</table>
