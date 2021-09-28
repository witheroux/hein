<script lang="ts">
  import { TITLE_SEPARATOR, TITLE_SUFFIX } from "$utils/constants/labels";

  import Block from '$lib/Block/index.svelte';
  import Button from '$lib/Button/index.svelte';
  import Input from '$lib/Input/index.svelte';
  import Link from '$lib/Link/index.svelte';

  import { checkValidity } from "$utils/actions/form";
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

  <form 
    method="POST" 
    action="/api/users/login" 
    class="flex flex-col"
    use:checkValidity
  >
    <Input 
      name="username" 
      label="Utilisateur"
      id="username"
      placeholder="coolguy123"
      required
      minlength={3}
      pattern="[A-Za-z0-9\-_]+"
      patternErrorMessage="Le champs peut seulement contenir des lettres de a à z, des chiffres des tirets(-) et des barres de soulignement(_)"
      hint="Minimum de 3 caractères. A-Z, 0-9, - et _."
    />

    <Input
      name="password"
      label="Mot de passe"
      id="password"
      type="password"
      placeholder="●●●●●●●●●●●"
      required
      minlength={8}
      hint="Minimum de 8 caractères."
    />

    <Button type="submit" isSmall>Me connecter</Button>

    <!-- <div class="mt-2">
      <Link href="/mot-de-passe-oublie">Mot de passe oublié?</Link>
    </div> -->
  </form>

  <svelte:fragment slot="bottom">
    <p class="text-center">
      <span class="mr-1">Pas de compte?</span>
      <Link href="/creer-un-compte">Créer un compte</Link>
    </p>
  </svelte:fragment>
</Block>
