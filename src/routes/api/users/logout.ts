import type { EndpointOutput } from "@sveltejs/kit/types/endpoint";


export function get(): EndpointOutput {
    return {
        status: 303,
        headers: {
            location: '/',
            'set-cookie': 'user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; SameSite=Strict',
        }
    }
}