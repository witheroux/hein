import type { ServerRequest } from '@sveltejs/kit/types/endpoint';
import type { User } from '$utils/types/users';

import Joi from 'joi';

import { db } from '$database';

import { encrypt } from '$utils/helpers/password';
import { formDataToObject, getHttpResponse, validationDetailsToError } from '$utils/helpers/request';
import { StatusCode } from '$utils/constants/httpResponse';
import { flash } from '$utils/helpers/request';

export const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(24)
        .required(),
    name: Joi.string()
        .pattern(/[\p{L}\- ]*/)
        .min(2)
        .max(50)
        .required(),
    password: Joi.string()
        .min(8)
        .max(64)
        .required(),
    confirmPassword: Joi.ref('password')
})
    .with('password', 'confirmPassword');

export async function post(req: ServerRequest) {
    const { body } = req;
    const data = formDataToObject(body);
    const { username, name, password } = data;
    const { error } = await schema.validate(data, { abortEarly: false });

    if (error) {
        return {
            status: StatusCode.BAD_REQUEST,
            body: {
                errors: validationDetailsToError(error.details),
            }
        };
    }

    let user: Partial<User>[] = [];
    try {
        user = await db.instance('hein_users')
            .insert({
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

    // TODO (William): Better output as to why the request was bad
    if (user.length === 0) {
        return getHttpResponse(StatusCode.BAD_REQUEST);
    }

    // FIXME: Redirect doesn't get this.
    // flash(req, { message: 'Compte créé avec succès', type: 'success' });

    return {
        status: 303,
        headers: {
            location: '/',
            'set-cookie': `user=${Buffer.from(JSON.stringify({...user[0]})).toString()}; Path=/; HttpOnly; SameSite=strict`,
        },
    }
}