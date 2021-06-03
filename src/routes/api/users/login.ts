import type { EndpointOutput, ServerRequest } from '@sveltejs/kit/types/endpoint';

import { Buffer } from 'buffer';
import Joi from 'joi';
import { User } from '$database';
import { compare } from '$utils/helpers/password';
import { formDataToObject, getHttpResponse, validationDetailsToError } from '$utils/helpers/request';
import { StatusCode } from '$utils/constants/httpResponse';

export const schema = Joi.object({
    username: Joi.string()
        .required(),
    password: Joi.string()
        .required(),
});

export async function post({ body }: ServerRequest): Promise<EndpointOutput> {
    const data = formDataToObject(body);
    const { username, password } = data;
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
        return {
            status: 400,
            body: {
                errors: validationDetailsToError(error.details),
            }
        }
    }

    let user: Partial<User> | undefined;
    try {
        user = await User.query()
            .select()
            .where({ username })
            .first();
    } catch (e) {
        // TODO (William): Log error somewhere
        console.error(e);
    }

    if (!user) {
        return getHttpResponse(StatusCode.NOT_FOUND);
    }

    if (!await compare(password, user?.password)) {
        return getHttpResponse(StatusCode.UNAUTHORIZED);
    }

    delete user.password;

    return {
        status: 303,
        headers: {
            location: '/',
            'set-cookie': `user=${Buffer.from(JSON.stringify({...user})).toString()}; Path=/; HttpOnly; SameSite=strict`,
        }
    }
}