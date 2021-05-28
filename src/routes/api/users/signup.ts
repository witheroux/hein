import type { ServerRequest } from '@sveltejs/kit/types/endpoint';
import type { User } from '$utils/types/users';

import { db } from '$database';
import { encrypt } from '$utils/helpers/password';

export async function post({ body }: ServerRequest) {
    const name = body.get('name');
    const username = body.get('username');
    const password = body.get('password');
    const confirmPassword = body.get('confirm-password');

    let user: Partial<User>[] = [];
    try {
        user = await db.instance('hein_users').insert({
            name,
            username,
            password: await encrypt(password),
        }, [
            'id',
            'uuid',
            'name',
            'username',
        ]);
    } catch (e) {
        // TODO (William): Log error somewhere
        console.error(e);
    }

    if (user.length === 0) {
        return {
            status: 400,
            body: {
                error: {
                    message: 'Bad request',
                    code: 400,
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