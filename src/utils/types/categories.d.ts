import type { User } from "./users"

export interface Category {
    id: number;
    name: string;
    slug: string;
    created_by: User;
}