import PocketBase from 'pocketbase';

import { writable } from 'svelte/store';

export const pb = new PocketBase('https://rtchat.pockethost.io/'); // remote
// export const pb = new PocketBase('http://192.168.18.10:8090'); // local

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.set(pb.authStore.model);
});