<script lang="ts">
  import type { Flash } from '$utils/types/request';
  
  import { flashes } from '$stores/flash';

  export let flash: Flash[] = [];

  flashes.set([...flash])

  function clearFlashes() {
    flash = []
    flashes.set([]);
  }
</script>

<svelte:window on:sveltekit:navigation-end={clearFlashes}></svelte:window>

<div>
  {#each flash as f}
    <div>{f.message}</div>
  {/each}
  <slot/>
</div>
