<script lang="ts">
    import { TITLE_SEPARATOR, TITLE_SUFFIX } from "$utils/constants/labels";

    import Block from '$lib/Block/index.svelte';
    import Button from '$lib/Button/index.svelte';
    import Input from '$lib/Input/index.svelte';
    import Link from '$lib/Link/index.svelte';
</script>

<svelte:head>
	<title>Connexion {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>

<Block>
  <h1 class="font-title text-4xl bg-clip-text text-transparent bg-gradient-to-b from-orange-300 to-orange-600">
    Re-bonjour!
  </h1>
  <p class="font-text text-gray-700 text-lg max-w-xs m-auto mb-7" >
    Connectez-vous pour ajouter des cartes et catégories.
  </p>

  <form method="POST" action="/api/users/login" class="flex flex-col">
    <Input 
      name="username" 
      label="Utilisateur"
      id="username"
      placeholder="coolguy123"
    />

    <Input
      name="password"
      label="Mot de passe"
      id="password"
      type="password"
      placeholder="●●●●●●●●●●●"
    />

    <Button type="submit" isSmall>Me connecter</Button>
    <Link className="mt-2" href="/mot-de-passe-oublie">Mot de passe oublié?</Link>
  </form>
  
  <svelte:fragment slot="bottom">
    <p class="text-center">
      Pas de compte? 
      <Link className="ml-1" href="/creer-un-compte">Créer un compte</Link>
    </p>
  </svelte:fragment>
</Block>
