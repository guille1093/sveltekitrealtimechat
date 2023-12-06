<script>
	import { onMount, onDestroy } from 'svelte';
	import { currentUser, pb } from './pocketbase';
	import {
		StructuredList,
		StructuredListHead,
		StructuredListRow,
		StructuredListCell,
		StructuredListBody,
		TextInput,
		Button
	} from 'carbon-components-svelte';
	import Send from 'carbon-icons-svelte/lib/Send.svelte';

	let newMessage;
	let messages = [];
	let unsubscribe;

	onMount(async () => {
		// Get initial messages
		const resultList = await pb.collection('messages').getList(1, 50, {
			sort: '-created',
			expand: 'user'
		});
		messages = resultList.items.reverse();

		// Subscribe to realtime messages
		unsubscribe = await pb.collection('messages').subscribe('*', async ({ action, record }) => {
			if (action === 'create') {
				// Fetch associated user
				const user = await pb.collection('users').getOne(record.user);
				record.expand = { user };
				messages = [...messages, record];
			}
			if (action === 'delete') {
				messages = messages.filter((m) => m.id !== record.id);
			}
		});
	});

	// Unsubscribe from realtime messages
	onDestroy(() => {
		unsubscribe?.();
	});

	async function sendMessage() {
		const data = {
			user: $currentUser.id,
			text: newMessage
		};
		const createdMessage = await pb.collection('messages').create(data);
		newMessage = '';
	}
</script>

<div class="flex flex-col w-full items-center justify-center ">
	<main class="py-8 md:w-2/3">
		{#each messages as message (message.id)}
			{#if $currentUser.id !== message.user}
				<div class="col-start-1 col-end-8 p-3 rounded-lg">
					<div class="flex flex-row items-center">
						<img
							class="me-3 rounded-full w-11 h-11"
							src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${message.expand?.user?.username}.svg`}
							alt="avatar"
							width="40px"
						/>
						<div class="relative ml-3 text-sm bg-neutral-800 py-2 px-4 shadow rounded-xl">
							<strong>{message.expand?.user?.name}</strong>
							{new Date(message.created).toLocaleDateString('es-AR', {
								day: '2-digit',
								month: 'short',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
							<div>{message.text}</div>
						</div>
					</div>
				</div>
			{/if}

			{#if $currentUser.id === message.user}
				<div class="col-start-6 col-end-13 p-3 rounded-lg">
					<div class="flex items-center justify-start flex-row-reverse">
						<img
							class="ms-3 rounded-full w-11 h-11"
							src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${message.expand?.user?.username}.svg`}
							alt="avatar"
							width="40px"
						/>
						<div class="relative ml-3 text-sm bg-blue-700 py-2 px-4 shadow rounded-xl">
							<strong>{message.expand?.user?.name}</strong>
							{new Date(message.created).toLocaleDateString('es-AR', {
								day: '2-digit',
								month: 'short',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
							<div>{message.text}</div>
						</div>
					</div>
				</div>
			{/if}
		{/each}
	</main>

	<div class="sticky bottom-0 left-0 z-50 w-full">
		<form on:submit|preventDefault={sendMessage}>
			<div class="flex-row flex">
				<TextInput size="small" placeholder="Mensaje" bind:value={newMessage} />
				<Button size="small" icon={Send} type="submit">Enviar</Button>
			</div>
		</form>
	</div>
</div>


