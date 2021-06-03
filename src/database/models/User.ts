import type { IUser } from '$utils/types/users';

import { Model } from 'objection';
export class User extends Model implements IUser {
    id: number;
    uuid: string;
    username: string;
    name: string;
    password: string;

    static get tableName(): string {
        return 'hein_users';
    }

    static get idColumn(): string {
        return 'id';
    }
}