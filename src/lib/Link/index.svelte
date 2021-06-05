<script lang="ts">
  export let href;
  export let className = '';
</script>

<a
  {href}
  class="bg-clip-text font-bold text-transparent bg-gradient-to-b from-orange-300 to-orange-600 no-underline hover:underline {className}"
>
  <slot />
</a>
