<script module lang="ts">
	export interface ComputedFieldProps {
		label: string;
		value: number;
		classes?: string;
	}
</script>

<script lang="ts">
	const { label, value, classes }: ComputedFieldProps = $props();
</script>

<div class={`flex items-center justify-between text-sm ${classes ?? ''}`}>
	<span class="text-muted">{label}</span>
	<span class="tabular-nums">{value.toLocaleString()}</span>
</div>
