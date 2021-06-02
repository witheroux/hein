<script>
  import { getContext } from 'svelte';
  import { TITLE_SEPARATOR, TITLE_SUFFIX } from '$utils/constants/labels';
  import { USER_CONTEXT_KEY } from '$utils/constants/contexts';

  const { logged } = getContext(USER_CONTEXT_KEY);
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

<h1>Liste des cartes</h1>
