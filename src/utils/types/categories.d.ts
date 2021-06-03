import type { IUser } from "./users"

export interface ICategory {
    id: number;
    name: string;
    slug: string;
    created_by_id: IUser;
}