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

  const { logged } = getContext(USER_CONTEXT_KEY);
  export let categories: ICategory[] = [];
</script>

<svelte:head>
  <title>Catégories {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>

{#if logged}
  <form method="POST" action="/api/categories">
    <label>
      Nom
      <input name="name" />
    </label>

    <button type="submit">Ajouter la catégorie</button>
  </form>
{/if}

<h1>Liste des catégories</h1>
<ul>
  {#if categories.length !== 0}
    {#each categories as category}
      <li><a href="/categories/{category.slug}">{category.name}</a></li>
    {/each}
  {/if}
</ul>
