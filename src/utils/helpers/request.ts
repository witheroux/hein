import type Joi from "joi";
import type { URLSearchParams } from "url";
import type { EndpointOutput, JSONValue, ServerRequest } from "@sveltejs/kit/types/endpoint";
import type { ReadOnlyFormData } from "@sveltejs/kit/types/helper";
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
    const entries = queryOrBody.entries();
    let entry = entries.next();
    
    while(!entry.done) {
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