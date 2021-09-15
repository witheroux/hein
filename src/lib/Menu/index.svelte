<script lang="ts">
  import playIcon from '$lib/icons/play-button.svg';
  import categoriesIcon from '$lib/icons/tag.svg';
  import cardsIcon from '$lib/icons/poker.svg';

  import MenuItem from '$lib/MenuItem/index.svelte';
</script>

<div class="flex flex-col space-y-5 mb-12">
  <MenuItem href="/api/play" icon={playIcon}>
    <svelte:fragment slot="text">Jouer</svelte:fragment>
  </MenuItem>
  <MenuItem href="/categories" icon={categoriesIcon}>
    <svelte:fragment slot="text">Catégories</svelte:fragment>
  </MenuItem>
  <MenuItem href="/cartes" icon={cardsIcon}>
    <svelte:fragment slot="text">Cartes</svelte:fragment>
  </MenuItem>
</div>
