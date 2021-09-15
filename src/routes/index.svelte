<script lang="ts">
  import { getContext } from 'svelte';
  import { TITLE_SEPARATOR, TITLE_SUFFIX } from '$utils/constants/labels';
  import { USER_CONTEXT_KEY } from '$utils/constants/contexts';

  const { logged } = getContext(USER_CONTEXT_KEY);
</script>

<svelte:head>
  <title>Accueil {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>
