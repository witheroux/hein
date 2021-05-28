export async function up(knex) {
    return knex.schema.raw(`
CREATE EXTENSION IF NOT EXISTS unaccent;
COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
`);
}


export async function down(knex) {
    return knex.schema.raw(`
DROP EXTENSION IF EXISTS unaccent;
DROP EXTENSION IF EXISTS "uuid-ossp";
`);
}

