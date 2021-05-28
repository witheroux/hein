import type { ServerRequest } from '@sveltejs/kit/types/endpoint';

import { db } from '$database';
import type { User } from '$utils/types/users';
import { compare } from '$utils/helpers/password';

export async function post({ body }: ServerRequest) {
    const username = body.get('username');
    const password = body.get('password');

    let user: Partial<User>[] = [];
    try {
        user = await db.instance.select()
            .from<User>('hein_users')
            .where('username', '=', username);
    } catch (e) {
        // TODO (William): Log error somewhere
        console.error(e);
    }

    if (user.length === 0) {
        return {
            status: 404,
            body: {
                error: {
                    message: 'Not found',
                    code: 404,
                }
            }
        }
    }

    const isCorrectPassword = await compare(password, user[0].password);

    if (!isCorrectPassword) {
        return {
            status: 401,
            body: {
                error: {
                    message: 'Unauthorized',
                    code: 401,
                }
            }
        }
    }

    return {
        status: 200,
        body: {
            ...user[0]
        }
    }
}