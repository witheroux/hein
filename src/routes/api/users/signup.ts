import type { EndpointOutput } from '@sveltejs/kit/types/endpoint';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

import Joi from 'joi';

import { encrypt } from '$utils/helpers/password';
import { formDataToObject, getHttpResponse, isReadOnlyFormData, validationDetailsToError } from '$utils/helpers/request';
import { StatusCode } from '$utils/constants/httpResponse';
import { User } from '$database';

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

export async function post(req: ServerRequest): Promise<EndpointOutput> {
    const { body } = req;

    if (!isReadOnlyFormData(body)) return getHttpResponse(StatusCode.BAD_REQUEST);

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

    let user: User | undefined;
    try {
        user = await User.query()
            .insert({
                name,
                username,
                password: await encrypt(password),
            })
            .returning([
                'id',
                'uuid',
                'username',
                'name'
            ]);
    } catch (e) {
        // TODO (William): Log error somewhere
        console.error(e);
    }

    // TODO (William): Better output as to why the request was bad
    if (!user) {
        return getHttpResponse(StatusCode.BAD_REQUEST);
    }

    // FIXME: Redirect doesn't get this.
    // flash(req, { message: 'Compte créé avec succès', type: 'success' });

    delete user.password;

    return {
        status: 303,
        headers: {
            location: '/',
            'set-cookie': `user=${Buffer.from(JSON.stringify({ ...user })).toString()}; Path=/; HttpOnly; SameSite=strict`,
        },
    }
}