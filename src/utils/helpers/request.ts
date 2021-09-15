import type Joi from "joi";
import type { EndpointOutput } from "@sveltejs/kit/types/endpoint";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";
import type { JSONValue, ReadOnlyFormData } from "@sveltejs/kit/types/helper";
import type { Flash } from "$utils/types/request";

import { MESSAGES, StatusCode } from "$utils/constants/httpResponse";

export function flash(req: ServerRequest, flashObject: Flash): void {
    req.locals.flash = req.locals.flash || [];
    req.locals.flash.push(flashObject);
}

export function formDataToObject<T extends Record<string, string> = Record<string, any>>(query: URLSearchParams): T;
export function formDataToObject<T extends Record<string, string> = Record<string, any>>(body: ReadOnlyFormData): T;
export function formDataToObject<T extends Record<string, string> = Record<string, any>>(queryOrBody: URLSearchParams | ReadOnlyFormData): T {
    const data = {};
    const entries = queryOrBody instanceof URLSearchParams ? queryOrBody[Symbol.iterator]() : queryOrBody.entries();
    let entry = entries.next();

    while (!entry.done) {
        data[entry.value[0]] = entry.value[1];
        entry = entries.next();
    }

    return data as T;
}

export function getHttpResponse(status: StatusCode): EndpointOutput {
    return {
        status,
        body: {
            error: {
                message: MESSAGES[status],
            }
        }
    }
}

export function validationDetailsToError(details: Joi.ValidationErrorItem[]): JSONValue {
    const errorObject = details.reduce((acc, detail) => {
        acc[detail.context.key] = {
            reason: detail.message,
            value: detail.context?.value ?? ''
        };

        return acc;
    }, {});

    return errorObject;
}

export function isReadOnlyFormData(body: string | Uint8Array | ReadOnlyFormData): body is ReadOnlyFormData {
    const isString = typeof body === 'string';
    const isUint8Array = body instanceof Uint8Array;

    return !isString && !isUint8Array;
}