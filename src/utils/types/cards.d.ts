import type { Category } from "./categories";
import type { User } from "./users"

export interface Card {
    id: number;
    name: string;
    slug: string;
    category: Category
    created_by: User;
}