import { PG_URL } from '$utils/constants/env';
import knex, { Knex } from 'knex';
import { Model } from 'objection';

class Database {
    private knex: Knex;
    

    get isReady() {
        return !!this.knex;
    }

    constructor(private config: Knex.Config) {}

    init() {
        if (this.knex) return;
        
        this.knex = knex(this.config);

        Model.knex(this.knex);
    }
}


export const db = new Database({
    client: 'pg',
    connection: PG_URL,
});