import type Joi from "joi";
import type { EndpointOutput } from "@sveltejs/kit/types/endpoint";
import type { JSONValue, ReadOnlyFormData, RequestHeaders } from "@sveltejs/kit/types/helper";
import type { Flash, Session } from "$utils/types/request";

import { MESSAGES, StatusCode } from "$utils/constants/httpResponse";

const sessions = new Map<string, Session>();

export function flash(session: Session, type: Flash['type'], message: string): void {
    session.flash = session.flash || [];
    session.flash.push({ type, message });
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

export function validationDetailsToText(details: Joi.ValidationErrorItem[]): string {
    // TODO (William): Actually detail errors in a readable form.
    return 'Here are the errors: TODO';
}

export function isReadOnlyFormData(body: string | Uint8Array | ReadOnlyFormData): body is ReadOnlyFormData {
    const isString = typeof body === 'string';
    const isUint8Array = body instanceof Uint8Array;

    return !isString && !isUint8Array;
}

export function isEnhanced(headers: RequestHeaders) {
    return headers.accept === 'application/json';
}

function getDefaultSession(): Session {
    return {
        flash: [],
    };
}

export function getSessionWithId(id: string): Session {
    let session = sessions.get(id);

    if (!session) {
        session = getDefaultSession();
        sessions.set(id, session);
    }

    return session;
}

export function saveSession(id: string, session: Session): void {
    sessions.set(id, session);
}