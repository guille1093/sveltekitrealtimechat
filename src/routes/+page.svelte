<script>
	import Login from '$lib/Login.svelte';
	import Messages from '$lib/Messages.svelte';
	import { currentUser } from '$lib/pocketbase';
</script>


	<main class="p-2">
		<Login />
		{#if $currentUser}
			<Messages />
		{/if}
	</main>
