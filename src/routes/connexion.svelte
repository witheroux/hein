<script lang="ts">
    import { TITLE_SEPARATOR, TITLE_SUFFIX } from "$utils/constants/labels";
</script>

<svelte:head>
	<title>Connexion {TITLE_SEPARATOR} {TITLE_SUFFIX}</title>
</svelte:head>

<div>Connexion</div>

<form method="POST" action="/api/users/login">
    <label>
        <span>Utilisateur</span>
        <input name="username" />
    </label>
    
    <label>
        <span>Mot de passe</span>
        <input name="password" type="password" />
    </label>
    
    <button type="submit">Se connecter</button>
</form>


<style lang="postcss">
</style>
