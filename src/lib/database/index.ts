import { PG_SQL_DB, PG_SQL_HOST, PG_SQL_PASS, PG_SQL_PORT, PG_SQL_USER } from '$lib/env';
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
    connection: `postgres://${PG_SQL_USER}:${PG_SQL_PASS}@${PG_SQL_HOST}:${PG_SQL_PORT}/${PG_SQL_DB}`,
});