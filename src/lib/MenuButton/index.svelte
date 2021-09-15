<script lang="ts">
  export let toggled = false;
  export let className = '';
</script>

<button on:click type="button" class="mr-8 flex items-center tablet:hidden {className}">
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
    transition: transform 0.2s ease-in-out;
    width: 100%;
  }

  span:before,
  span:after {
    content: '';
    display: block;
    height: 4px;
    width: 16px;
    background-color: inherit;
    transition: inherit;
    border-radius: inherit;
  }

  span:before {
    left: 0;
    bottom: 8px;
    position: absolute;
    transform-origin: 12px 0px;
  }

  span:after {
    position: absolute;
    right: 0;
    top: 8px;
    transform-origin: 6px -2px;
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
