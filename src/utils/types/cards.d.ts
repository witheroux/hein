import type { ICategory } from "./categories";
import type { IUser } from "./users"

export interface ICard {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    category: ICategory;
    created_by_id: number;
    created_by: IUser;
}