<script>
	import { currentUser, pb } from './pocketbase';
	import { TextInput, Button, Tabs, Tab, TabContent } from 'carbon-components-svelte';
	import Login from 'carbon-icons-svelte/lib/Login.svelte';
	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';
	import { PasswordInput, FormGroup } from 'carbon-components-svelte';

	let username;
	let password;
	let passwordConfirm;

	async function login() {
		await pb.collection('users').authWithPassword(username, password);
	}

	async function signUp() {
		try {
			const data = {
				username,
				password,
				passwordConfirm,
				name: username
			};
			const createdUser = await pb.collection('users').create(data);
			await login();
		} catch (err) {
			console.error(err);
		}
	}

	function signOut() {
		pb.authStore.clear();
	}
</script>

{#if $currentUser}
	<div class="flex justify-around sticky top-0 left-0 z-50 w-full dark:bg-neutral-800">
		<div>
			<h4>PyLP2023</h4>
		</div>
		<div class="flex w-full justify-end">
			<p class="mx-2 mt-1">
				Sesión iniciada como @{$currentUser.username}
			</p>
			<Button size="small" icon={Logout} on:click={signOut}>Cerrar sesión</Button>
		</div>
	</div>
{:else}
	<div
		class="bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-black min-h-screen flex items-center justify-center"
	>
		<div class="container max-w-md mx-auto xl:max-w-3xl h-full flex shadow-black shadow-2xl">
			<div class="hidden xl:block xl:w-1/2">
				<img
					class="object-cover object-center overflow-hidden h-full w-full"
					src="https://images.unsplash.com/photo-1537100861360-bf6be4ddeac4?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8fA%3D%3D"
					alt="una playa xd"
				/>
			</div>
			<div class="w-full xl:w-1/2 p-8">
				<h1>PyLP2023</h1>
				<p>Chat en tiempo real</p>
				<Tabs>
					<Tab label="Iniciar sesión" />
					<Tab label="Registrarme" />
					<svelte:fragment slot="content">
						<TabContent>
							<h4 class="mt-14 mb-4">Inicie sesión en su cuenta</h4>
							<form on:submit|preventDefault>
								<FormGroup legendText="Nombre de usuario">
									<TextInput
										required
										placeholder="Ingrese su nombre de usuario"
										bind:value={username}
									/>
								</FormGroup>

								<FormGroup>
									<PasswordInput
										required
										labelText="Contraseña"
										placeholder="Ingrese su contraseña"
										invalidText="La contraseña debe tener al menos 8 caracteres"
										invalid={password && password.length < 8}
										bind:value={password}
									/>
								</FormGroup>
							</form>
							<div class="flex w-full justify-end">
								<Button size="small" disabled={!username || !password} icon={Login} on:click={login}
									>Iniciar sesión</Button
								>
							</div></TabContent
						>
						<TabContent>
							<h4 class="mt-14 mb-4">Registrese en el sistema</h4>
							<form on:submit|preventDefault>
								<FormGroup legendText="Nombre de usuario">
									<TextInput
										required
										placeholder="Ingrese su nombre de usuario"
										bind:value={username}
									/>
								</FormGroup>

								<FormGroup>
									<PasswordInput
										required
										labelText="Contraseña"
										placeholder="Ingrese su contraseña"
										bind:value={password}
										invalidText="La contraseña debe tener al menos 8 caracteres"
										invalid={password && password.length < 8}
									/>
								</FormGroup>

								<FormGroup>
									<PasswordInput
										required
										labelText="Confirmar contraseña"
										placeholder="Ingrese su contraseña"
										bind:value={passwordConfirm}
										invalidText="Las contraseñas no coinciden"
										invalid={password !== passwordConfirm}
									/>
								</FormGroup>
							</form>
							<div class="flex w-full justify-end">
								<Button
									size="small"
									icon={Login}
									disabled={!username ||
										!password ||
										!passwordConfirm ||
										password !== passwordConfirm}
									on:click={signUp}>Registrarme</Button
								>
							</div></TabContent
						>
					</svelte:fragment>
				</Tabs>
			</div>
		</div>
	</div>
{/if}
