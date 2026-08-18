<script module lang="ts">
	import InputField, { type InputFieldProps } from '$lib/components/ui-kit/InputField.svelte';

	export interface NumberFieldProps extends Omit<InputFieldProps, 'value'> {
		value?: number;
	}
</script>

<script lang="ts">
	let { value = $bindable(0), ...rest }: NumberFieldProps = $props();

	let raw = $state<string | null>(null);
	let text = $derived.by(() => {
		if (raw !== null && (Number.parseFloat(raw) || 0) === value) return raw;
		return String(Number(value.toFixed(1)));
	});

	const sanitize = (next: string) => {
		raw = next
			.replace(/[^\d.]/g, '')
			.replace(/(?<=\..*)\./g, '')
			.replace(/(?<!\d)\./, '')
			.replace(/(\.\d)\d*/, '$1');
		value = Number.parseFloat(raw) || 0;
	};
</script>

<InputField {...rest} bind:value={() => text, sanitize} />
