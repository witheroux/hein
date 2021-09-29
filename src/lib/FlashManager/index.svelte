<script lang="ts">
  import type { Flash } from '$utils/types/request';

  import FlashMessage from './Flash/index.svelte';
  
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
    <FlashMessage
      type={f.type}
      message={f.message}
    />
  {/each}
  <slot/>
</div>
