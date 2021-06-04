import type { RelationMapping } from 'objection';
import type { ICard } from '$utils/types/cards';
import type { ICategory } from '$utils/types/categories';
import type { IUser } from '$utils/types/users';

import { Model } from 'objection';

import { Category } from './Category';
import { User } from './User';

export class Card extends Model implements ICard {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    category: ICategory;
    created_by_id: number;
    created_by: IUser;
    static get tableName(): string {
        return 'hein_cards';
    }

    static get idColumn(): string {
        return 'id';
    }

    static get relationMappings(): Record<string, RelationMapping<Model>> {
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