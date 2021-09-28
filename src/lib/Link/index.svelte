<script lang="ts">
  export let href;
</script>

<a {href} class="text-orange-600 no-underline hover:underline">
  <span
    class="bg-clip-text font-bold text-transparent bg-gradient-to-b from-orange-300 to-orange-600 "
  >
    <slot />
  </span>
</a>
