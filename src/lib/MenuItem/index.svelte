<script lang="ts">
  export let href;
  export let icon;
</script>

<a {href} class="flex items-center text-orange-50">
  {@html icon}
  <span
    class="font-title ml-4 text-2xl bg-clip-text text-transparent bg-gradient-to-b from-orange-300 to-orange-600"
  >
    <slot name="text" />
  </span>
</a>

<style lang="postcss">
  a :global(svg) {
    width: 36px;
    height: 36px;
    fill: currentColor;
    transition: transform 0.2s ease-in-out;
  }
  a:hover :global(svg) {
    transform: scale(1.2);
  }
</style>
