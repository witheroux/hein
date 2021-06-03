import type { ICategory } from "./categories";
import type { IUser } from "./users"

export interface ICard {
    id: number;
    name: string;
    slug: string;
    category: ICategory
    created_by: IUser;
}