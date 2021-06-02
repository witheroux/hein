import { Model } from 'objection';

import { Category } from './Category';
import { User } from './User';

export class Card extends Model {
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
                    from: 'hein_cards.created_by_id',
                    to: 'hein_users.id',
                }
            },
            "category": {
                relation: Model.BelongsToOneRelation,
                modelClass: Category,
                join: {
                    from: 'hein_cards.category_id',
                    to: 'hein_categories.id',
                }
            }
        }
    }
}