<script lang="ts">
  import { getContext } from 'svelte';
  import Link from '$lib/Link/index.svelte';
  import { USER_CONTEXT_KEY } from '$utils/constants/contexts';

  const { logged, name } = getContext(USER_CONTEXT_KEY);
</script>

<div class="font-text text-base text-gray-100">
  {#if logged}
    <span class="mr-1">Pas <strong>{name}</strong>?</span>
    <Link href="/api/users/logout">Se déconnecter</Link>
  {:else}
    <span class="mr-1">
      <Link href="/connexion">Connexion</Link>
    </span>
    <Link href="/creer-un-compte">Créer un compte</Link>
  {/if}
</div>
