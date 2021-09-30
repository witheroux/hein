<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit/types/page';

  export async function load({ fetch, page }: LoadInput) {
    const { params } = page;
    const { slug } = params;
    const res: Response = await fetch(`/api/categories/${slug}`);

    if (res.ok) {
      const { categories } = await res.json();
      const [category] = categories;

      if (!category) {
        return {
          status: 404,
          error: 'Cette catégorie ne semble pas exister.'
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

  export let category: ICategory;

  const { id } = getContext(USER_CONTEXT_KEY);

  let modify = false;
  let isOwner = category.created_by_id === id;
  let value = category.name;

  function toggleModify() {
    modify = !modify;
  }
</script>

<svelte:head>
  <title>{category.name} {TITLE_SEPARATOR} Catégories {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>

{#if modify && isOwner}
  <form method="POST" action="/api/categories">
    <input type="hidden" name="_method" value="PATCH" />
    <input type="hidden" name="id" value={category.id} />
    <input name="name" {value} />
    <button type="submit">Soumettre</button>
    <button type="button" on:click={toggleModify}>Annuler</button>
  </form>
{:else if isOwner}
  <h1>{category.name}</h1>
  <button type="button" on:click={toggleModify}>Modifier</button>
{:else}
  <h1>{category.name}</h1>
{/if}

{#if category.created_by_id !== 0}
  <p>
    Cette catégorie a été créée par <a href="/utilisateurs/{category.created_by.username}"
      >{category.created_by.name}</a
    >
  </p>
{/if}

{#if isOwner}
  <form method="POST" action="/api/categories">
    <input type="hidden" name="_method" value="DELETE" />
    <input type="hidden" name="id" value={category.id} />
    <button type="submit">Supprimer</button>
  </form>
{/if}

<a href="/categories">Retour aux catégories</a>
