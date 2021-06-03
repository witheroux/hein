import type { RelationMapping } from 'objection';
import type { ICategory } from '$utils/types/categories';
import type { IUser } from '$utils/types/users';

import { Model } from 'objection';
import { User } from './User';

export class Category extends Model implements ICategory {
    id: number;
    name: string;
    slug: string;
    created_by: IUser;

    static get tableName(): string {
        return 'hein_categories';
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
                    from: 'hein_categories.created_by_id',
                    to: 'hein_users.id',
                }
            }
        }
    }
}