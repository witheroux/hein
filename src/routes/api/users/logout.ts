import type { EndpointOutput } from "@sveltejs/kit/types/endpoint";


export function get({ locals }): EndpointOutput {
    const { session } = locals;
    
    delete session.user;
    
    return {
        status: 303,
        headers: {
            location: '/',
        }
    }
}