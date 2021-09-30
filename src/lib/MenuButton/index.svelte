<script lang="ts">
  export let toggled = false;
</script>

<button on:click type="button" class="mr-8 flex items-center tablet:hidden">
  <span class="text-gray-100" class:toggled />
  <span class="sr-only">
    {toggled ? 'Fermer le menu' : 'Ouvrir le menu'}
  </span>
</button>

<style lang="postcss">
  button {
    height: 28px;
    width: 28px;
  }

  span:not(.sr-only) {
    background-color: currentColor;
    border-radius: 4px;
    display: block;
    height: 4px;
    position: relative;
    transform-origin: center;
    transition-property: transform;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
    width: 100%;
  }

  span:before,
  span:after {
    content: '';
    display: block;
    height: 4px;
    width: 16px;
    background-color: inherit;
    transition-duration: inherit;
    transition-timing-function: inherit;
    border-radius: inherit;
  }

  span:before {
    left: 0;
    bottom: 8px;
    position: absolute;
    transform-origin: 12px 0px;
    transition-property: transform bottom;
  }

  button:hover span:not(.sr-only):not(.toggled):before {
    bottom: 10px;
  }

  span:after {
    position: absolute;
    right: 0;
    top: 8px;
    transform-origin: 6px -2px;
    transition-property: transform top;
  }

  button:hover span:not(.sr-only):not(.toggled):after {
    top: 10px;
  }

  .toggled {
    transform: rotate(45deg);
  }

  .toggled:before {
    transform: rotate(-90deg);
  }

  .toggled:after {
    transform: rotate(90deg);
  }
</style>
