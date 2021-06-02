import type { User } from "./users";

export interface Session {
    flash?: Flash[];
    user?: Exclude<User, 'password'>;
}

export interface Flash {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}
