import { PG_URL } from '$utils/constants/env';
import knex, { Knex } from 'knex';

class Database {
    instance: Knex;

    get isReady() {
        return !!this.instance;
    }

    constructor(private config: Knex.Config) {}

    init() {
        if (this.instance) return;
        
        this.instance = knex(this.config);
    }
}


export const db = new Database({
    client: 'pg',
    connection: PG_URL,
});