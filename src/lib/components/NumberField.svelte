<script module lang="ts">
	import InputField, { type InputFieldProps } from '$lib/components/InputField.svelte';

	export interface NumberFieldProps extends Omit<InputFieldProps, 'value'> {
		value?: number;
	}
</script>

<script lang="ts">
	let { value = $bindable(0), ...rest }: NumberFieldProps = $props();

	// The typed text is kept alongside `value` because a number can't represent input that is
	// still in progress — `String(12)` would drop the trailing dot of '12.' as you type it.
	let text = $state(String(value));

	const sanitize = (next: string) => {
		// 1. Replace all non-digits with ''
		// 2. Drop any dot that isn't the first one
		// 3. Drop a leading dot with no digit before it
		// 4. Capture first digit after the dot and consume the rest
		text = next
			.replace(/[^\d.]/g, '')
			.replace(/(?<=\..*)\./g, '')
			.replace(/(?<!\d)\./, '')
			.replace(/(\.\d)\d*/, '$1');
		value = Number.parseFloat(text) || 0;
	};
</script>

<InputField {...rest} bind:value={() => text, sanitize} />
