<script lang="ts">
  import playIcon from '$lib/icons/play-button.svg';
  import categoriesIcon from '$lib/icons/tag.svg';
  import cardsIcon from '$lib/icons/poker.svg';

  import MenuItem from '$lib/MenuItem/index.svelte';
</script>

<div>
  <MenuItem href="/api/play">
    <svelte:fragment slot="icon">{playIcon}</svelte:fragment>
    <svelte:fragment slot="text">Jouer</svelte:fragment>
  </MenuItem>
  <MenuItem href="/categories">
    <svelte:fragment slot="icon">{categoriesIcon}</svelte:fragment>
    <svelte:fragment slot="text">Catégories</svelte:fragment>
  </MenuItem>
  <MenuItem href="/cartes">
    <svelte:fragment slot="icon">{cardsIcon}</svelte:fragment>
    <svelte:fragment slot="text">Cartes</svelte:fragment>
  </MenuItem>
</div>
