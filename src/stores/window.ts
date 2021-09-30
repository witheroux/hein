import type { Popup } from '$utils/types/window';
import type { Writable } from 'svelte/store';

import { writable } from 'svelte/store';

export const popup: Writable<Popup | null> = writable();