<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit/types/page';
  import { StatusCode } from '$utils/constants/httpResponse';

  export async function load({ fetch, page }: LoadInput) {
    const { params } = page;
    const { category } = params;
    const cardsRes: Response = await fetch(`/api/cards?category=${category}`);
    const categoriesRes: Response = await fetch(`/api/categories?slug=${category}`);

    if (cardsRes.ok && categoriesRes.ok) {
      const { cards } = await cardsRes.json();
      const { categories } = await categoriesRes.json();
      const [category] = categories;

      if (!category) {
        return {
          status: StatusCode.NOT_FOUND,
          error: 'Cette catégorie ne semble pas exister.'
        };
      }

      return {
        props: {
          cards,
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
  import type { ICard } from '$utils/types/cards';
  import type { ICategory } from '$utils/types/categories';

  import { TITLE_SEPARATOR, TITLE_SUFFIX } from '$utils/constants/labels';

  export let cards: ICard[];
  export let category: ICategory;
</script>

<svelte:head>
  <title>Catégorie {category.name} {TITLE_SEPARATOR} Cartes {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>

<h1>Cartes de catégorie {category.name}</h1>

<ul>
  {#each cards as card}
    <li><a href="/cartes/{card.category.slug}/{card.slug}">{card.name}</a></li>
  {/each}
</ul>

<a href="/cartes">Retour à la liste de catégories de cartes</a>
