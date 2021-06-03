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

export async function post(req): Promise<EndpointOutput> {
    const data = formDataToObject(req.body);
    const { name } = data;
    const { user } = req.locals;

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