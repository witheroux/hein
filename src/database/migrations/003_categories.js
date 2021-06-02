export async function up(knex) {
    return knex.schema.raw(`
CREATE TABLE hein_categories (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    slug character varying(50) NOT NULL,
    created_by_id integer DEFAULT 0 NOT NULL
);

CREATE SEQUENCE hein_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE hein_categories_id_seq OWNED BY hein_categories.id;

ALTER TABLE ONLY hein_categories ALTER COLUMN id SET DEFAULT nextval('hein_categories_id_seq'::regclass);

ALTER TABLE ONLY hein_categories
    ADD CONSTRAINT hein_categories_pk PRIMARY KEY (id);

ALTER TABLE ONLY hein_categories
    ADD CONSTRAINT hein_categories_un UNIQUE (slug);

ALTER TABLE ONLY hein_categories
    ADD CONSTRAINT hein_categories_fk FOREIGN KEY (created_by_id) REFERENCES hein_users(id) ON UPDATE SET DEFAULT ON DELETE SET DEFAULT;


CREATE TRIGGER trg_slug_insert BEFORE INSERT ON hein_categories FOR EACH ROW WHEN (((new.name IS NOT NULL) AND (new.slug IS NULL))) EXECUTE FUNCTION set_slug_from_name();
`);
}


export async function down(knex) {
    return knex.schema.raw(`
DROP TABLE IF EXISTS hein_categories CASCADE;
DROP SEQUENCE IF EXISTS hein_categories_id_seq CASCADE;
`);
}

