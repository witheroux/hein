<script lang="ts">
  export let href;
</script>

<a {href} class="flex justify-center text-orange-50">
  <slot name="icon" />
  <span
    class="font-title text-2xl bg-clip-text text-transparent bg-gradient-to-b from-orange-300 to-orange-600"
  >
    <slot name="text" />
  </span>
</a>

<style lang="postcss">
  svg {
    width: 36px;
    height: 36px;
    fill: currentColor;
  }
</style>
