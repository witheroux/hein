export async function up(knex) {
    return knex.schema.raw(`
CREATE TABLE hein_users (
    id integer NOT NULL,
    uuid uuid DEFAULT uuid_generate_v4() NOT NULL,
    username character varying(24) NOT NULL,
    password character varying(64) NOT NULL,
    name character varying(50) NOT NULL
);

CREATE SEQUENCE hein_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE hein_users_id_seq OWNED BY hein_users.id;

ALTER TABLE ONLY hein_users ALTER COLUMN id SET DEFAULT nextval('hein_users_id_seq'::regclass);

ALTER TABLE ONLY hein_users
    ADD CONSTRAINT hein_users_pk PRIMARY KEY (id);

ALTER TABLE ONLY hein_users
    ADD CONSTRAINT hein_users_un UNIQUE (id, uuid, username);

`);
}


export async function down(knex) {
    return knex.schema.raw(`
DROP TABLE IF EXISTS hein_users CASCADE;
DROP SEQUENCE IF EXISTS hein_users_id_seq CASCADE;
`)
}

