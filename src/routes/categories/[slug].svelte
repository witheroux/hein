<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit/types/page';

  export async function load({ fetch, page }: LoadInput) {
    const { params } = page;
    const { slug } = params;
    const res: Response = await fetch(`/api/categories?slug=${slug}`);

    if (res.ok) {
      const { categories } = await res.json();
      const [category] = categories;

      if (!category) {
        return {
          status: 404,
          error: 'Cette catégorie ne semble pas exister'
        };
      }

      return {
        props: {
          category
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
  import type { ICategory } from '$utils/types/categories';

  import { getContext } from 'svelte';

  import { TITLE_SEPARATOR, TITLE_SUFFIX } from '$utils/constants/labels';
  import { USER_CONTEXT_KEY } from '$utils/constants/contexts';

  const { logged } = getContext(USER_CONTEXT_KEY);
  export let category: ICategory;

  console.log(category);
</script>

<svelte:head>
  <title>{category.name} {TITLE_SEPARATOR} Catégories {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>

<h1>{category.name}</h1>

{#if category.created_by_id !== 0}
  <p>
    Cette catégorie a été créée par <a href="/utilisateurs/{category.created_by.username}"
      >{category.created_by.name}</a
    >
  </p>
{/if}

<a href="/categories">Retour aux catégories</a>
