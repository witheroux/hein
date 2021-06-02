import { Model } from 'objection';

export class User extends Model {
    static get tableName() {
        return 'hein_users';
    }

    static get idColumn() {
        return 'id';
    }
}