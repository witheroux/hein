import type { GetSession, Handle, ServerResponse } from '@sveltejs/kit/types/hooks';
import type { ServerRequest } from '@sveltejs/kit/types/endpoint';
import type { Session } from '$utils/types/request';

import cookie from 'cookie';
import { v4 as uuid } from 'uuid';

import { db } from '$database';

export const handle: Handle = async ({ request, render }): Promise<ServerResponse> => {
    const { userid, user = '{}' } = cookie.parse(request.headers.cookie || '');
    const flashes = JSON.parse(request.headers['X-HEIN-FLASH'] || '[]');

    if (!db.isReady) {
        db.init();
    }

    if (request.query.has('_method')) {
		request.method = request.query.get('_method').toUpperCase();
	}

    request.locals.userid = userid || uuid();
    request.locals.flash = flashes || [];
    request.locals.user = JSON.parse(Buffer.from(user).toString('utf-8'));

	const response = await render(request);

	if (!userid) {
		response.headers['set-cookie'] = `userid=${request.locals.userid}; Path=/; HttpOnly; SameSite=strict`;
	}

	return response;
}

export const getSession: GetSession = (request: ServerRequest): Session => {
    const {
        flash,
        user,
    } = request.locals;

    return {
        flash,
        user,
    }
}