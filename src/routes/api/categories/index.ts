import type { EndpointOutput } from "@sveltejs/kit/types/endpoint";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";

import Joi from "joi";

import { StatusCode } from "$utils/constants/httpResponse";
import { flash, formDataToObject, getHttpResponse, isEnhanced, isReadOnlyFormData, validationDetailsToError, validationDetailsToText } from "$utils/helpers/request";
import { Category } from "$database";
import type { JSONValue } from "@sveltejs/kit/types/helper";

export async function get(): Promise<EndpointOutput> {
    const categoriesQuery = Category.query()
        .select()
        .orderBy('name')
        .withGraphFetched('created_by')
        .modifyGraph('created_by', (builder) => builder.select('id', 'uuid', 'name', 'username'));

    let categories: Category[] = [];

    try {
        categories = await categoriesQuery;
    } catch (e) {
        // TODO (William): Log error somewhere
        console.error(e);
        
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    return {
        status: StatusCode.OK,
        body: {
            categories: categories as unknown as JSONValue,
        }
    }
}

const postSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(128)
        .required(),
});

export async function post({ body, locals, headers }: ServerRequest): Promise<EndpointOutput> {
    const enhanced = isEnhanced(headers);
    const { session } = locals;

    if (!isReadOnlyFormData(body)) {
        if (enhanced) return getHttpResponse(StatusCode.BAD_REQUEST);

        flash(session, 'error', 'Une erreur est survenue. Veuillez réessayer plus tard.');

        return {
            status: StatusCode.SEE_OTHER,
            headers: {
                location: '/categories',
            }
        };
    }

    const data = formDataToObject(body);
    const { name, csrf } = data;
    const { user } = locals;
    
    if (csrf !== session.csrf) {
        if (enhanced) return getHttpResponse(StatusCode.BAD_REQUEST);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/categories',
            }
        }
    }

    if (!user) {
        if (enhanced) return getHttpResponse(StatusCode.UNAUTHORIZED);

        flash(session, 'error', 'Vous n\'êtes pas authorisé à ajouter une catégorie.');

        return {
            status: StatusCode.SEE_OTHER,
            headers: {
                location: '/categories',
            }
        };
    }

    const { error } = postSchema.validate(data, { allowUnknown: true });

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
                location: '/categories',
            }
        }
    }

    let category: Category;
    try {
        category = await Category.query()
            .insert({
                name,
                "created_by_id": user.id,
            })
            .returning('slug');
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
        if (enhanced) return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.SEE_OTHER,
            headers: {
                location: `/categories`,
            }
        };
    }

    // TODO (William): More explanation as to why it's a bad request
    if (!category) {
        if (enhanced) return getHttpResponse(StatusCode.BAD_REQUEST);

        flash(session, 'error', 'Une erreur est survenue. Veuillez réessayer plus tard');

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/categories',
            }
        }
    }

    if (enhanced) {
        return {
            status: StatusCode.OK,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...category
            }),
        }
    }

    flash(session, 'success', 'Catégorie créée avec succès.');

    return {
        status: StatusCode.SEE_OTHER,
        headers: {
            location: `/categories/${category.slug}`
        }
    }
}

const patchSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(128)
        .required(),
    id: Joi.number()
        .required(),
});

export async function patch({ body, headers, locals }: ServerRequest): Promise<EndpointOutput> {
    const enhanced = isEnhanced(headers);
    const { session } = locals;

    if (!isReadOnlyFormData(body)) {
        if (enhanced) return getHttpResponse(StatusCode.BAD_REQUEST);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/categories',
            }
        }
    }

    const data = formDataToObject(body);
    const { name, id, csrf } = data;
    const { user } = locals;

    if (!user) {
        if (enhanced) return getHttpResponse(StatusCode.UNAUTHORIZED);

        flash(session, 'error', 'Vous n\'êtes pas authorisé à mettre à jour une catégorie.');

        return {
            status: StatusCode.SEE_OTHER,
            headers: {
                location: '/categories',
            }
        };
    }
    
    if (csrf !== session.csrf) {
        if (enhanced) return getHttpResponse(StatusCode.BAD_REQUEST);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/categories',
            }
        }
    }

    const { error } = patchSchema.validate(data, { allowUnknown: true, abortEarly: false });

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
                location: '/categories',
            }
        }
    }

    let category: Category;
    try {
        category = await Category.query()
            .select()
            .andWhere('id', '=', id)
            .first();
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
        if (enhanced) return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.SEE_OTHER,
            headers: {
                location: `/categories`,
            }
        };
    }

    // TODO (William): More explanation as to why it's a bad request
    if (!category) {
        if (enhanced) return getHttpResponse(StatusCode.BAD_REQUEST);

        flash(session, 'error', 'Une erreur est survenue. Veuillez réessayer plus tard');

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/categories',
            }
        }
    }

    if (category.created_by_id !== user.id) {
        if (enhanced) return getHttpResponse(StatusCode.FORBIDDEN);

        flash(session, 'error', 'Vous n\'avez pas la permission pour mettre à jour cette catégorie.');

        return {
            status: StatusCode.SEE_OTHER,
            headers: {
                location: `/categories/${category.slug}`,
            }
        };
    }

    try {
        await Category.query()
            .updateAndFetchById(id, { name });
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
        if (enhanced) return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.SEE_OTHER,
            headers: {
                location: `/categories/${category.slug}`,
            }
        };
    }

    if (enhanced) {
        return {
            status: StatusCode.OK,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...category
            }),
        }
    }

    flash(session, 'success', 'Catégorie mise à jour avec succès.');

    return {
        status: StatusCode.SEE_OTHER,
        headers: {
            location: `/categories/${category.slug}`
        }
    }
}

const delSchema = Joi.object({
    id: Joi.number()
        .required(),
});

export async function del({ body, headers, locals }: ServerRequest): Promise<EndpointOutput> {
    const enhanced = isEnhanced(headers);
    const { session } = locals;

    if (!isReadOnlyFormData(body)) {
        if (enhanced) return getHttpResponse(StatusCode.BAD_REQUEST);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/categories',
            }
        }
    }

    const data = formDataToObject(body);
    const { id , csrf} = data;
    const { user } = locals;

    if (!user) {
        if (enhanced) return getHttpResponse(StatusCode.UNAUTHORIZED);

        flash(session, 'error', 'Vous n\'êtes pas authorisé à supprimer une catégorie.');

        return {
            status: StatusCode.SEE_OTHER,
            headers: {
                location: '/categories',
            }
        };
    }
    
    if (csrf !== session.csrf) {
        if (enhanced) return getHttpResponse(StatusCode.BAD_REQUEST);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.FOUND,
            headers: {
                location: '/categories',
            }
        }
    }

    const { error } = delSchema.validate(data, { allowUnknown: true });

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
                location: '/categories',
            }
        }
    }

    let category: Category;
    try {
        category = await Category.query()
            .select()
            .where('id', '=', id)
            .first();
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
        if (enhanced) return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.SEE_OTHER,
            headers: {
                location: `/categories`,
            }
        };
    }

    if (category.created_by_id !== user.id) {
        if (enhanced) return getHttpResponse(StatusCode.FORBIDDEN);

        flash(session, 'error', 'Vous n\'avez pas la permission pour supprimer cette catégorie.');

        return {
            status: StatusCode.SEE_OTHER,
            headers: {
                location: `/categories/${category.slug}`,
            }
        };
    }

    try {
        await Category.query()
            .deleteById(id)
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
        if (enhanced) return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);

        flash(session, 'error', 'Une erreur est survenue, veuillez réessayer plus tard.');

        return {
            status: StatusCode.SEE_OTHER,
            headers: {
                location: `/categories/${category.slug}`,
            }
        };
    }

    if (enhanced) {
        return {
            status: StatusCode.NO_CONTENT,
        }
    }

    flash(session, 'success', 'Catégorie supprimée avec succès.');

    return {
        status: StatusCode.SEE_OTHER,
        headers: {
            location: `/categories`
        }
    }
}