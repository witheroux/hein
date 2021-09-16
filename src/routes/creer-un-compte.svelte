<script lang="ts">
  import { TITLE_SEPARATOR, TITLE_SUFFIX } from '$utils/constants/labels';

  import Block from '$lib/Block/index.svelte';
  import Button from '$lib/Button/index.svelte';
  import Input from '$lib/Input/index.svelte';
  import Link from '$lib/Link/index.svelte';
</script>

<svelte:head>
  <title>Créer un compte {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>

<Block>
  <h1 class="font-title text-4xl bg-clip-text text-transparent bg-gradient-to-b from-orange-300 to-orange-600">
    Bienvenue!
  </h1>
  <p class="font-text text-gray-700 text-lg max-w-xs m-auto mb-7" >
    Créez-vous un compte pour ajouter des cartes et des catégories.
  </p>

  <form method="POST" action="/api/users/signup" class="flex flex-col">

    <Input 
      name="username" 
      label="Utilisateur"
      id="username"
      placeholder="coolguy123"
    />

    <Input 
      name="name" 
      label="Nom"
      id="name"
      placeholder="Cool Guy"
    />

    <Input
      name="password"
      label="Mot de passe"
      id="password"
      type="password"
      placeholder="●●●●●●●●●●●"
    />

    <Input
      name="confirm-password"
      label="Confirmer Mot de passe"
      id="confirm-password"
      type="password"
      placeholder="●●●●●●●●●●●"
    />

    <Button type="submit" isSmall>Me connecter</Button>
  </form>

  <svelte:fragment slot="bottom">
    <p class="text-center">
      Déjà un compte? 
      <Link className="ml-1" href="/connexion">Me connecter</Link>
    </p>
  </svelte:fragment>
</Block>
