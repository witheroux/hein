import { db } from '$lib/database';
import type { Handle, ServerResponse } from '@sveltejs/kit/types/hooks';

export const handle: Handle = ({ request, render }): ServerResponse | Promise<ServerResponse> => {
    if (!db.isReady) db.init();
    return render(request);
}