import type { EndpointOutput } from '@sveltejs/kit/types/endpoint';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

import Joi from 'joi';
import { User } from '$database';
import { compare } from '$utils/helpers/password';
import { flash, formDataToObject, getHttpResponse, isEnhanced, isReadOnlyFormData, validationDetailsToError, validationDetailsToText } from '$utils/helpers/request';
import { StatusCode } from '$utils/constants/httpResponse';

export const schema = Joi.object({
    username: Joi.string()
        .min(3)
        .required(),
    password: Joi.string()
        .min(8)
        .required(),
});

export async function post({ body, headers, locals }: ServerRequest): Promise<EndpointOutput> {
    const enhanced = isEnhanced(headers);
    const { session } = locals;

    if (!isReadOnlyFormData(body)) {
        if (enhanced) return getHttpResponse(StatusCode.BAD_REQUEST);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/connexion',
            }
        }
    }

    const data = formDataToObject(body);
    const { username, password, csrf } = data;

    if (csrf !== session.csrf) {
        if (enhanced) return getHttpResponse(StatusCode.BAD_REQUEST);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/connexion',
            }
        }
    }

    const { error } = schema.validate(data, { abortEarly: false, allowUnknown: true, });

    if (error) {
        if (enhanced) {
            return {
                status: StatusCode.BAD_REQUEST,
                body: {
                    errors: validationDetailsToError(error.details),
                }
            }
        }

        flash(session, 'error', validationDetailsToText(error.details));

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/connexion',
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
        if (enhanced) return getHttpResponse(StatusCode.UNAUTHORIZED);

        flash(session, 'error', 'Mot de passe/courriel invalide');

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/connexion',
            }
        }
    }

    if (!await compare(password, user?.password)) {
        if (enhanced) return getHttpResponse(StatusCode.UNAUTHORIZED);
        
        flash(session, 'error', 'Mot de passe/courriel invalide');
        
        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/connexion',
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

    flash(session, 'success', 'Vous êtes maintenant connecté.e.');

    return {
        status: StatusCode.SEE_OTHER,
        headers: {
            location: '/',
        }
    }
}