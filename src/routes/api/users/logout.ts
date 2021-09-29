import type { EndpointOutput } from "@sveltejs/kit/types/endpoint";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";

import { StatusCode } from "$utils/constants/httpResponse";
import { flash } from "$utils/helpers/request";

export function get({ locals }: ServerRequest): EndpointOutput {
    const { session } = locals;
    
    delete session.user;

    flash(session, 'success', 'Vous avez été déconnecté.e avec succès.')
    
    return {
        status: StatusCode.SEE_OTHER,
        headers: {
            location: '/',
        }
    }
}