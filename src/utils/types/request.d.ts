import type { IUser } from "./users";

export interface Session {
    flash?: Flash[];
    user?: Exclude<IUser, 'password'>;
    cards?: Set<number>;
}
export interface Flash {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}
