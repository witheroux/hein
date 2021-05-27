--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: set_slug_from_name(); Type: FUNCTION; Schema: public; Owner: william
--

CREATE FUNCTION public.set_slug_from_name() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
declare 
	c public.cards;
	slug_seq varchar;
begin
  new.slug := slugify(new.name);
  slug_seq := 'slug_' || lower(TG_TABLE_NAME) || '_' || new.slug || '_seq';
 
  execute format('select * from %I where $1 = slug', TG_TABLE_NAME) 
  	into c
    using new.slug;
  	
  if (c is not NULL) then 
  	execute format('create sequence if not exists %I', slug_seq);
  	new.slug := new.slug || '-' || nextval(slug_seq);
  end if;
 
  return new;
end
$_$;


ALTER FUNCTION public.set_slug_from_name() OWNER TO william;

--
-- Name: slugify(text); Type: FUNCTION; Schema: public; Owner: william
--

CREATE FUNCTION public.slugify(v text) RETURNS text
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
$$;


ALTER FUNCTION public.slugify(v text) OWNER TO william;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cards; Type: TABLE; Schema: public; Owner: william
--

CREATE TABLE public.cards (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    slug character varying(128) NOT NULL,
    category integer NOT NULL,
    created_by integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.cards OWNER TO william;

--
-- Name: card_id_seq; Type: SEQUENCE; Schema: public; Owner: william
--

CREATE SEQUENCE public.card_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.card_id_seq OWNER TO william;

--
-- Name: card_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: william
--

ALTER SEQUENCE public.card_id_seq OWNED BY public.cards.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: william
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    slug character varying(50) NOT NULL
);


ALTER TABLE public.categories OWNER TO william;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: william
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO william;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: william
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: slug_categories_category_seq; Type: SEQUENCE; Schema: public; Owner: william
--

CREATE SEQUENCE public.slug_categories_category_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.slug_categories_category_seq OWNER TO william;

--
-- Name: users; Type: TABLE; Schema: public; Owner: william
--

CREATE TABLE public.users (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(24) NOT NULL,
    password character varying(64) NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.users OWNER TO william;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: william
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO william;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: william
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cards id; Type: DEFAULT; Schema: public; Owner: william
--

ALTER TABLE ONLY public.cards ALTER COLUMN id SET DEFAULT nextval('public.card_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: william
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: william
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: cards cards_pk; Type: CONSTRAINT; Schema: public; Owner: william
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pk PRIMARY KEY (id);


--
-- Name: cards cards_un; Type: CONSTRAINT; Schema: public; Owner: william
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_un UNIQUE (name, slug, category);


--
-- Name: categories categories_pk; Type: CONSTRAINT; Schema: public; Owner: william
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pk PRIMARY KEY (id);


--
-- Name: categories categories_un; Type: CONSTRAINT; Schema: public; Owner: william
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_un UNIQUE (slug);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: william
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- Name: users users_un; Type: CONSTRAINT; Schema: public; Owner: william
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_un UNIQUE (id, uuid, username);


--
-- Name: cards trg_slug_insert; Type: TRIGGER; Schema: public; Owner: william
--

CREATE TRIGGER trg_slug_insert BEFORE INSERT ON public.cards FOR EACH ROW WHEN (((new.name IS NOT NULL) AND (new.slug IS NULL))) EXECUTE FUNCTION public.set_slug_from_name();


--
-- Name: categories trg_slug_insert; Type: TRIGGER; Schema: public; Owner: william
--

CREATE TRIGGER trg_slug_insert BEFORE INSERT ON public.categories FOR EACH ROW WHEN (((new.name IS NOT NULL) AND (new.slug IS NULL))) EXECUTE FUNCTION public.set_slug_from_name();


--
-- Name: cards cards_fk; Type: FK CONSTRAINT; Schema: public; Owner: william
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_fk FOREIGN KEY (category) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cards cards_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: william
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_fk_1 FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE SET DEFAULT ON DELETE SET DEFAULT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: william
--

GRANT ALL ON SCHEMA public TO postgres;


--
-- Name: TABLE cards; Type: ACL; Schema: public; Owner: william
--

GRANT ALL ON TABLE public.cards TO postgres;


--
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: william
--

GRANT ALL ON TABLE public.categories TO postgres;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: william
--

GRANT ALL ON TABLE public.users TO postgres;


--
-- PostgreSQL database dump complete
--

