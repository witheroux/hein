<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/page';
  import { StatusCode } from '$utils/constants/httpResponse';

  export async function load({ fetch, page }: LoadInput): Promise<LoadOutput> {
    const res = await fetch(`/api/cards?slug=${page.params.slug}`);

    if (res.ok) {
      const { cards } = await res.json();
      const [card] = cards;

      if (!card) {
        return {
          status: StatusCode.NOT_FOUND,
          error: 'Cette carte ne semble pas exister'
        };
      }

      return {
        props: {
          card
        }
      };
    }

    return {
      status: StatusCode.INTERNAL_SERVER_ERROR,
      error:
        'Une erreur est survenue lors du chargement de la catégorie. Veuillez réessayer plus tard.'
    };
  }
</script>

<script lang="ts">
  import type { ICard } from '$utils/types/cards';

  import { goto } from '$app/navigation';

  import Button from '$lib/Button/index.svelte';
  import Card from '$lib/Card/index.svelte';
  import Timer from '$lib/Timer/index.svelte';

  import { TITLE_SEPARATOR, TITLE_SUFFIX } from '$utils/constants/labels';

  export let card: ICard;

  function redirectToNewCard() {
    goto('/api/play');
  }
</script>

<svelte:head>
  <title>{card.name} {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>

<section class="flex flex-col justify-between items-center w-full">
  <Timer />
  <div class="flex flex-col items-center my-12 w-full text-center">
    <p class="font-title text-gray-300 text-2xl hidden laptop:block mb-2">Votre carte</p>
    <Card category={card.category.name} card={card.name} />
  </div>

  <Button on:click={redirectToNewCard}>Nouvelle carte</Button>
</section>

<style lang="postcss">
</style>
