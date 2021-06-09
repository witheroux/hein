<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit/types/page';

  export async function load({ fetch, page }: LoadInput) {
    const { params } = page;
    const { slug, category } = params;
    const res: Response = await fetch(`/api/cards?slug=${slug}&category=${category}`);
    const categoriesRes: Response = await fetch('/api/categories');

    if (res.ok) {
      const { cards } = await res.json();
      const { categories } = await categoriesRes.json();
      const [card] = cards;

      if (!card) {
        return {
          status: 404,
          error: 'Cette catégorie ne semble pas exister'
        };
      }

      return {
        props: {
          card,
          categories
        }
      };
    }

    return {
      status: 500,
      error:
        'Une erreur est survenue lors du chargement de la catégorie. Veuillez réessayer plus tard.'
    };
  }
</script>

<script lang="ts">
  import type { ICard } from '$utils/types/cards';
  import type { ICategory } from '$utils/types/categories';

  import { getContext } from 'svelte';

  import { TITLE_SEPARATOR, TITLE_SUFFIX } from '$utils/constants/labels';
  import { USER_CONTEXT_KEY } from '$utils/constants/contexts';

  export let card: ICard;
  export let categories: ICategory[];

  const { id } = getContext(USER_CONTEXT_KEY);

  let modify = false;
  let isOwner = card.created_by_id === id;
  let value = card.name;
  let selectedCategory = card.category.id;

  function toggleModify() {
    modify = !modify;
  }
</script>

<svelte:head>
  <title>{card.name} {TITLE_SEPARATOR} Cartes {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>

{#if modify && isOwner}
  <form method="POST" action="/api/cards">
    <input type="hidden" name="_method" value="PATCH" />
    <input type="hidden" name="id" value={card.id} />
    <input name="name" bind:value />

    <label>
      Catégorie
      <select name="category_id" bind:value={selectedCategory}>
        {#each categories as category}
          <option value={category.id} selected={selectedCategory == category.id}
            >{category.name}</option
          >
        {/each}
      </select>
    </label>

    <button type="submit">Soumettre</button>
    <button type="button" on:click={toggleModify}>Annuler</button>
  </form>
{:else if isOwner}
  <h1>{card.name}</h1>
  <button type="button" on:click={toggleModify}>Modifier</button>
{:else}
  <h1>{card.name}</h1>
{/if}

{#if card.created_by_id !== 0}
  <p>
    Cette catégorie a été créée par <a href="/utilisateurs/{card.created_by.username}"
      >{card.created_by.name}</a
    >
  </p>
{/if}

{#if isOwner}
  <form method="POST" action="/api/cards">
    <input type="hidden" name="_method" value="DELETE" />
    <input type="hidden" name="id" value={card.id} />
    <button type="submit">Supprimer</button>
  </form>
{/if}

<a href="/cartes/{card.category.slug}">Retour à la catégorie</a>
