<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit/types/page';

  export async function load({ fetch }: LoadInput) {
    const res: Response = await fetch('/api/categories');

    if (res.ok) {
      const { categories } = await res.json();

      return {
        props: {
          categories
        }
      };
    }

    return {
      status: 500,
      error:
        'Une erreur est survenue lors du chargement des catégories. Veuillez réessayer plus tard.'
    };
  }
</script>

<script lang="ts">
  import type { ICategory } from '$utils/types/categories';

  import { getContext } from 'svelte';

  import { TITLE_SEPARATOR, TITLE_SUFFIX } from '$utils/constants/labels';
  import { USER_CONTEXT_KEY } from '$utils/constants/contexts';

  export let categories: ICategory[] = [];

  const { logged } = getContext(USER_CONTEXT_KEY);
</script>

<svelte:head>
  <title>Cartes {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>

{#if logged}
  <form method="POST" action="/api/cards">
    <label>
      Nom
      <input name="name" />
    </label>

    <label>
      Catégorie
      <select name="category_id">
        {#each categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </label>

    <button type="submit">Ajouter la carte</button>
  </form>
{/if}

<h1>Cartes par catégorie</h1>
<ul>
  {#each categories as category}
    <li><a href="/cartes/{category.slug}">{category.name}</a></li>
  {/each}
</ul>
