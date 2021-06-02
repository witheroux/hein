import { Model } from 'objection';
import { User } from './User';

export class Category extends Model {
    static get tableName() {
        return 'hein_categories';
    }

    static get idColumn() {
        return 'id';
    }

    static get relationMappings() {
        return {
            "created_by": {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'hein_categories.created_by_id',
                    to: 'hein_users.id',
                }
            }
        }
    }
}