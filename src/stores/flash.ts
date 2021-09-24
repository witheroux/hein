import type { Flash } from '$utils/types/request';
import type { Writable } from 'svelte/store';

import { writable } from 'svelte/store';

export const flashes: Writable<Flash[]> = writable([]);