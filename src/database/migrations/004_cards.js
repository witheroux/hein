export function up(knex) {
    return knex.schema.raw(`
CREATE TABLE hein_cards (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    slug character varying(128) NOT NULL,
    category_id integer NOT NULL,
    created_by_id integer DEFAULT 0 NOT NULL
);

CREATE SEQUENCE hein_cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE hein_cards_id_seq OWNED BY hein_cards.id;

ALTER TABLE ONLY hein_cards ALTER COLUMN id SET DEFAULT nextval('hein_cards_id_seq'::regclass);

ALTER TABLE ONLY hein_cards
    ADD CONSTRAINT hein_cards_pk PRIMARY KEY (id);

ALTER TABLE ONLY hein_cards
    ADD CONSTRAINT hein_cards_un UNIQUE (slug, category_id);

ALTER TABLE ONLY hein_cards
    ADD CONSTRAINT hein_cards_fk_1 FOREIGN KEY (created_by_id) REFERENCES hein_users(id) ON UPDATE SET DEFAULT ON DELETE SET DEFAULT;

ALTER TABLE ONLY hein_cards
    ADD CONSTRAINT hein_cards_fk FOREIGN KEY (category_id) REFERENCES hein_categories(id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE TRIGGER trg_slug_insert BEFORE INSERT ON hein_cards FOR EACH ROW WHEN (((new.name IS NOT NULL) AND (new.slug IS NULL))) EXECUTE FUNCTION set_slug_from_name();
`)
}


export function down(knex) {
    return knex.schema.raw(`
DROP TABLE IF EXISTS hein_cards CASCADE;
DROP SEQUENCE IF EXISTS hein_cards_id_seq CASCADE;
`)
}