import type { EndpointOutput } from '@sveltejs/kit/types/endpoint';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

import Joi from 'joi';

import { encrypt } from '$utils/helpers/password';
import { flash, formDataToObject, getHttpResponse, isEnhanced, isReadOnlyFormData, validationDetailsToError, validationDetailsToText } from '$utils/helpers/request';
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

export async function post({ body, locals, headers }: ServerRequest): Promise<EndpointOutput> {
    const { session } = locals;
    const enhanced = isEnhanced(headers);
    
    if (!isReadOnlyFormData(body)) {
        if (enhanced) return getHttpResponse(StatusCode.BAD_REQUEST);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/creer-un-compte',
            }
        }
    }

    const data = formDataToObject(body);
    const { username, name, password } = data;
    const { error } = await schema.validate(data, { abortEarly: false });

    if (error) {
        if (enhanced) {
            return {
                status: StatusCode.BAD_REQUEST,
                body: {
                    errors: validationDetailsToError(error.details),
                }
            };
        }

        flash(session, 'error', validationDetailsToText(error.details));

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/creer-un-compte',
            }
        }
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
        if (enhanced) return getHttpResponse(StatusCode.BAD_REQUEST);

        flash(session, 'error', 'Une erreur est survenue. Veuillez réessayer plus tard');

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/creer-un-compte',
            }
        }
    }


    delete user.password;
    session.user = { ...user };

    if (enhanced) {
        return {
            status: StatusCode.OK,
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(user),
        }
    }

    flash(session, 'success', 'Votre compte a été créé. Vous êtes maintenant connecté.e.');

    return {
        status: StatusCode.SEE_OTHER,
        headers: {
            location: '/',
        }
    }
}