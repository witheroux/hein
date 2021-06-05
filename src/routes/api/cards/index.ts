import type { EndpointOutput, JSONValue, ServerRequest } from "@sveltejs/kit/types/endpoint";
import type { ICard } from "$utils/types/cards";

import Joi from "joi";

import { StatusCode } from "$utils/constants/httpResponse";
import { formDataToObject, getHttpResponse, validationDetailsToError } from "$utils/helpers/request";
import { Card, Category } from "$database";

const getSchema = Joi.object({
    slug: Joi.string()
        .min(3)
        .max(128)
        .optional(),
    category: Joi.string()
        .min(3)
        .max(128)
        .optional()
});

export async function get({ query }: ServerRequest): Promise<EndpointOutput> {
    const data = formDataToObject(query); 
    const { category, slug } = data;

    const { error } = getSchema.validate(query, { allowUnknown: true });

    if (error) {
        return {
            status: StatusCode.BAD_REQUEST,
            body: {
                errors: validationDetailsToError(error.details)
            }
        }
    }

    let cardQuery = Card.query()
        .select()
        .orderBy('name')
        .withGraphFetched('[created_by, category]')
        .modifyGraph('created_by', (builder) => builder.select('id', 'uuid', 'name', 'username'));

    let cards: Card[] = [];

    if (category) {
        cardQuery = cardQuery
            .innerJoin(Category.tableName, `${Category.tableName}.id`, `${Card.tableName}.category_id`)
            .where(`${Category.tableName}.slug`, category);
    }

    if (slug) {
        cardQuery = cardQuery.where(`${Card.tableName}.slug`, slug);
    }

    try {
        cards = await cardQuery;
    } catch (e) {
        // TODO (William): Log error somewhere
        console.error(e);
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    return {
        status: 200,
        body: {
            cards: cards as unknown as JSONValue,
        }
    }
}

const postSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(128)
        .required(),
    category_id: Joi.number()
        .required(),
});

export async function post({ body, locals }: ServerRequest): Promise<EndpointOutput> {
    const data = formDataToObject(body);
    const { name, category_id } = data;
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

    let card: ICard;
    try {
        card = await Card.query()
            .insertAndFetch({
                name,
                category_id: parseInt(category_id),
                created_by_id: user.id,
            })
            .withGraphFetched('category');
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    // TODO (William): More explanation as to why it's a bad request
    if (!card) {
        return getHttpResponse(StatusCode.BAD_REQUEST);
    }

    return {
        status: 303,
        headers: {
            location: `/cartes/${card.category.slug}/${card.slug}`
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
    category_id: Joi.number()
        .required(),
});

export async function patch({ body, locals }: ServerRequest): Promise<EndpointOutput> {
    const data = formDataToObject(body);
    const { name, id, category_id } = data;
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

    let card: Card;
    try {
        card = await Card.query()
            .select()
            .andWhere('id', '=', id)
            .first();
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    // TODO (William): More explanation as to why it's a bad request
    if (!card) {
        return getHttpResponse(StatusCode.BAD_REQUEST);
    }

    if (card.created_by_id !== user.id) {
        return getHttpResponse(StatusCode.FORBIDDEN);
    }

    try {
        card = await Card.query()
            .updateAndFetchById(id, { name, category_id })
            .withGraphFetched('category');
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    return {
        status: 303,
        headers: {
            location: `/cartes/${card.category.slug}/${card.slug}`
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

    let card: Card;
    try {
        card = await Card.query()
            .select()
            .where('id', '=', id)
            .first();
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    if (card.created_by_id !== user.id) {
        return getHttpResponse(StatusCode.FORBIDDEN);
    }

    try {
        await Card.query()
            .deleteById(id)
    } catch (e) {
        // TODO (William): Log errors somewhere
        console.error(e);
        return getHttpResponse(StatusCode.INTERNAL_SERVER_ERROR);
    }

    return {
        status: 303,
        headers: {
            location: `/cartes`
        }
    }
}