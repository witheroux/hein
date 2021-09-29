import type { GetSession, Handle, ServerResponse } from '@sveltejs/kit/types/hooks';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';
import type { Session } from '$utils/types/request';

import cookie from 'cookie';
import { v4 as uuid } from 'uuid';

import { db } from '$database';
import { getSessionWithId, isReadOnlyFormData } from '$utils/helpers/request';

export const handle: Handle = async ({ request, resolve }): Promise<ServerResponse> => {
    const { session } = cookie.parse(request.headers.cookie || '');

    if (!db.isReady) {
        db.init();
    }

    if (request.query.has('_method') || (isReadOnlyFormData(request.body) && request.body?.has('_method'))) {
        request.method = request.query.get('_method')?.toUpperCase()
            || (isReadOnlyFormData(request.body) && request.body?.get('_method')?.toUpperCase())
            || request.method;
    }

    // Get the current session for the user
    request.locals.sessionid = session || uuid();
    request.locals.session = getSessionWithId(session);

    const response = await resolve(request);

    if (!session) {
        response.headers['set-cookie'] = `session=${request.locals.sessionid}; Path=/; HttpOnly; SameSite=strict`;
    }

    return response;
}

export const getSession: GetSession = (request: ServerRequest): Session => {
    const { session } = request.locals;

    const flash = session.flash.splice(0, session.flash.length);

    // Generate a new CSRF token for the next request
    session.csrf = uuid();

    return {
        ...session,
        flash,
    };
}