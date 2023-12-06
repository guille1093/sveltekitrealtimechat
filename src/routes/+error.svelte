<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let message404 = 'No se encontró la página';
	onMount(() => {
		if ($page.status === 404) {
			alert(message404);
		}
	});
</script>

<h1>Error {$page.status}</h1>
<a href="/">Volver al inicio</a>
