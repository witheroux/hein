import type { EndpointOutput, JSONValue, ServerRequest } from "@sveltejs/kit/types/endpoint";

import Joi from "joi";

import { StatusCode } from "$utils/constants/httpResponse";
import { formDataToObject, getHttpResponse, validationDetailsToError } from "$utils/helpers/request";
import { Category } from "$database";

const getSchema = Joi.object({
    slug: Joi.string()
        .min(3)
        .max(128)
        .optional()
});

export async function get({ query }: ServerRequest): Promise<EndpointOutput> {
    const data = formDataToObject(query); 
    const { slug } = data;

    const { error } = getSchema.validate(query, { allowUnknown: true });

    if (error) {
        return {
            status: StatusCode.BAD_REQUEST,
            body: {
                errors: validationDetailsToError(error.details)
            }
        }
    }

    let categoriesQuery = Category.query()
        .select()
        .orderBy('name')
        .withGraphFetched('created_by')
        .modifyGraph('created_by', (builder) => builder.select('id', 'uuid', 'name', 'username'));

    let categories: Category[] = [];

    if (slug) {
        categoriesQuery = categoriesQuery.where({ slug });
    }

    try {
        categories = await categoriesQuery;
    } catch (e) {
        // TODO (William): Log error somewhere
        console.error(e);
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    return {
        status: 200,
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

export async function post({ body, locals }: ServerRequest): Promise<EndpointOutput> {
    const data = formDataToObject(body);
    const { name } = data;
    const { user } = locals;

    if (!user) {
        return getHttpResponse(StatusCode.UNAUTHORIZED);
    }
    
    const validation = postSchema.validate(data, { allowUnknown: true });

    if (validation.error) {
        return {
            status: StatusCode.BAD_REQUEST,
            body: {
                errors: validationDetailsToError(validation.error.details),
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
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    // TODO (William): More explanation as to why it's a bad request
    if (!category) {
        return getHttpResponse(StatusCode.BAD_REQUEST);
    }

    return {
        status: 303,
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

export async function patch({ body, locals }: ServerRequest): Promise<EndpointOutput> {
    const data = formDataToObject(body);
    const { name, id } = data;
    const { user } = locals;

    if (!user) {
        return getHttpResponse(StatusCode.UNAUTHORIZED);
    }
    
    const validation = patchSchema.validate(data, { allowUnknown: true, abortEarly: false });

    if (validation.error) {
        return {
            status: StatusCode.BAD_REQUEST,
            body: {
                errors: validationDetailsToError(validation.error.details),
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
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    // TODO (William): More explanation as to why it's a bad request
    if (!category) {
        return getHttpResponse(StatusCode.BAD_REQUEST);
    }

    if (category.created_by_id !== user.id) {
        return getHttpResponse(StatusCode.FORBIDDEN);
    }

    try {
        await Category.query()
            .updateAndFetchById(id, { name });
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    return {
        status: 303,
        headers: {
            location: `/categories/${category.slug}`
        }
    }
}

const delSchema = Joi.object({
    id: Joi.number()
        .required(),
});

export async function del({ body, locals }: ServerRequest): Promise<EndpointOutput> {
    const data = formDataToObject(body);
    const { id } = data;
    const { user } = locals;

    if (!user) {
        return getHttpResponse(StatusCode.UNAUTHORIZED);
    }

    const validation = delSchema.validate(data, { allowUnknown: true });

    if (validation.error) {
        return {
            status: StatusCode.BAD_REQUEST,
            body: {
                errors: validationDetailsToError(validation.error.details),
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
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    if (category.created_by_id !== user.id) {
        return getHttpResponse(StatusCode.FORBIDDEN);
    }

    try {
        await Category.query()
            .deleteById(id)
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    return {
        status: 303,
        headers: {
            location: `/categories`
        }
    }
}