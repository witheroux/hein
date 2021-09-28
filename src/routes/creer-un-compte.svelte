<script lang="ts">
  import { getContext } from 'svelte';

  import { TITLE_SEPARATOR, TITLE_SUFFIX } from '$utils/constants/labels';
  import { checkValidity } from '$utils/actions/form';
  import { CSRF_CONTEXT_KEY } from '$utils/constants/contexts';

  import Block from '$lib/Block/index.svelte';
  import Button from '$lib/Button/index.svelte';
  import Input from '$lib/Input/index.svelte';
  import Link from '$lib/Link/index.svelte';

  const csrf: string = getContext(CSRF_CONTEXT_KEY);
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

  <form 
    method="POST" 
    action="/api/users/signup" 
    class="flex flex-col"
    use:checkValidity
  >
    <input type="hidden" name="csrf" value={csrf} />

    <Input 
      name="username" 
      label="Utilisateur"
      id="username"
      placeholder="coolguy123"
      required
      minlength={3}
      pattern="[A-Za-z0-9\-_]+"
      patternErrorMessage="Le champs peut seulement contenir des lettres de a à z, des chiffres des tirets(-) et des barres de soulignement(_)."
      hint="Minimum de 3 caractères. A-Z, 0-9, - et _."
    />

    <Input 
      name="name" 
      label="Nom"
      id="name"
      placeholder="Cool Guy"
      required
      minlength={3}
      pattern={"^\\p{L}(\\p{L}| (?! |-)|-(?! |-))+"}
      patternErrorMessage="Le champs doit commencé par une lettre. Plusiers espaces et/ou tirets ne peuvent pas se suivre."
      hint="Minimum de 3 caractères. Lettres, espaces et tirets."
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

    <Input
      name="confirm-password"
      label="Confirmer Mot de passe"
      id="confirm-password"
      type="password"
      placeholder="●●●●●●●●●●●"
      required
      match="password"
    />

    <Button type="submit" isSmall>Créer mon compte</Button>
  </form>

  <svelte:fragment slot="bottom">
    <p class="text-center">
      <span class="mr-1">Déjà un compte?</span>
      <Link href="/connexion">Me connecter</Link>
    </p>
  </svelte:fragment>
</Block>
