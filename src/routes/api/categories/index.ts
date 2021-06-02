import type { Category } from "$utils/types/categories";
import type { ServerRequest } from "@sveltejs/kit/types/endpoint";

import Joi from "joi";

import { StatusCode } from "$utils/constants/httpResponse";
import { formDataToObject, getHttpResponse, validationDetailsToError } from "$utils/helpers/request";
import { db } from "$database";

const getSchema = Joi.object({
    slug: Joi.string()
        .min(3)
        .max(128)
        .optional()
});

export async function get({ query }: ServerRequest) {
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

    let categoriesQuery = db.instance('hein_categories')
        .select();

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
            categories,
        }
    }
}

const postSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(128)
        .required(),
});

export async function post(req) {
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

    let category: Partial<Category>[] = [];
    try {
        category = await db.instance('hein_categories')
            .insert({
                name,
                "created_by": user.id,
            }, [
                "slug"
            ]);
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
    }

    // TODO (William): More explanation as to why it's a bad request
    if (category.length === 0) {
        return getHttpResponse(StatusCode.BAD_REQUEST);
    }

    return {
        status: 303,
        headers: {
            location: `/categories/${category[0].slug}`
        }
    }
}