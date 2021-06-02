<script lang="ts">
  import { TITLE_SEPARATOR, TITLE_SUFFIX } from '$utils/constants/labels';
</script>

<svelte:head>
  <title>Créer un compte {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>

<div>Créer un compte</div>

<form method="POST" action="/api/users/signup">
  <label>
    <span>Utilisateur</span>
    <input name="username" />
  </label>

  <label>
    <span>Nom</span>
    <input name="name" />
  </label>

  <label>
    <span>Mot de passe</span>
    <input name="password" type="password" />
  </label>

  <label>
    <span>Confirmer le mot de passe</span>
    <input name="confirmPassword" type="password" />
  </label>

  <button type="submit">Créer un compte</button>
</form>

<style lang="postcss">
</style>
