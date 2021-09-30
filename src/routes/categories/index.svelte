<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit/types/page';

  export async function load({ fetch, page }: LoadInput) {
    const sort = page.query.get('sort') || 'name';
    const res: Response = await fetch(`/api/categories?sort=${sort}`);

    if (res.ok) {
      const { categories } = await res.json();

      return {
        props: {
          categories,
          sort,
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

  import { getContext, onMount } from 'svelte';

  import { TITLE_SEPARATOR, TITLE_SUFFIX } from '$utils/constants/labels';
  import { USER_CONTEXT_KEY } from '$utils/constants/contexts';

  import deleteIcon from '$lib/icons/delete.svg';

  import Button from '$lib/Button/index.svelte';
  import Card from '$lib/Card/index.svelte';
  import Link from '$lib/Link/index.svelte';

  const { logged } = getContext(USER_CONTEXT_KEY);
  export let categories: ICategory[] = [];
  export let sort: string;

  const SORT_OPTIONS = [
    ['name', 'Nom'],
    ['author', 'Auteur'],
    // ['date', 'Date'],
  ]

  const showNewPopup = () => {};
  const showDeletePopup = (id: number) => {}; 

  onMount(() => {
    console.log('mounting');
    const params = new URLSearchParams(location.search);
    sort = params.get('sort') || SORT_OPTIONS[0][0];
  });
</script>

<svelte:head>
  <title>Catégories {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>

<div class="flex flex-col w-full h-full">
  <div class="flex items-center">
    <h1 class="font-title text-4xl bg-clip-text text-transparent bg-gradient-to-b from-orange-300 to-orange-600 mr-4">
      Catégories
    </h1>

    {#if logged}
      <Button on:click={showNewPopup} isSmall>Ajouter une catégorie</Button>
    {/if}
  </div>
  <div class="flex items-center mt-8">
    <span class="text-gray-100 mr-2 text-semibold">Classer par :</span>
    {#each SORT_OPTIONS as [type, name]}
      <span class="w-14 mr-2 text-center">
        <Link 
          href="/categories?sort={type}" 
          selected={sort === type}
          on:click={() => sort = type}
        >
          {name}
        </Link>
      </span>
    {/each}
  </div>
  <ul class="mt-6 grid gap-7 auto-rows-auto desktop:grid-cols-3 laptop:grid-cols-2 grid-cols-1">
    {#if categories.length !== 0}
      {#each categories as category}
        <li>
          <Card href="/categories/{category.slug}" title={category.name}>
            <span class="absolute right-0 top-0">
              <Button on:click={() => showDeletePopup(category.id)}>
                {@html deleteIcon}
              </Button>
            </span>
          </Card>
        </li>
      {/each}
    {/if}
  </ul>
</div>

<style lang="postcss">
  span :global(svg) {
    width: 20px;
    height: 20px;
    fill: red;
  }
</style>