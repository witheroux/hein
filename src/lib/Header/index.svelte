<script lang="ts">
  import logo from './logo.png';
  import { getContext } from 'svelte';
  import { USER_CONTEXT_KEY } from '$utils/constants/contexts';

  const { logged, name } = getContext(USER_CONTEXT_KEY);
</script>

<header>
  <a href="/">
    <img src={logo} alt="Hein?" />
  </a>

  {#if logged}
    Salut {name}!
    <a href="/api/users/logout">Se déconnecter</a>
  {:else}
    <a href="/connexion">Connexion</a>
    <a href="/creer-un-compte">Créer un compte</a>
  {/if}
</header>

<style lang="postcss">
</style>
