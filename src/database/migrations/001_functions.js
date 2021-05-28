export async function up(knex) {
    return knex.schema.raw(`
CREATE FUNCTION set_slug_from_name() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE 
    c record;
    slug_seq varchar;
BEGIN
    NEW.slug := slugify(NEW.name);
    slug_seq := 'slug_' || lower(TG_TABLE_NAME) || '_' || NEW.slug || '_seq';

    EXECUTE format('SELECT * FROM %I WHERE $1 = slug', TG_TABLE_NAME) 
        INTO c
        USING NEW.slug;
    
    IF (c IS NOT NULL) THEN 
        EXECUTE format('CREATE SEQUENCE IF NOT EXISTS %I OWNED BY %I', slug_seq, TG_TABLE_NAME);
        NEW.slug := NEW.slug || '-' || nextval(slug_seq);
    END IF;

    RETURN NEW;
END
$_$;

CREATE FUNCTION slugify(v text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
BEGIN
    -- 1. trim trailing and leading whitespaces from text
    -- 2. remove accents (diacritic signs) from a given text
    -- 3. lowercase unaccented text
    -- 4. replace non-alphanumeric (excluding hyphen, underscore) with a hyphen
    -- 5. trim leading and trailing hyphens
    RETURN trim(BOTH '-' FROM regexp_replace(lower(unaccent(trim(v))), '[^a-z0-9\\-_]+', '-', 'gi'));
END;
$$
`)
}


export async function down(knex) {
    return knex.schema.raw(`
DROP FUNCTION IF EXISTS set_slug_from_name();
DROP FUNCTION IF EXISTS slugify(v text);
`)
}

