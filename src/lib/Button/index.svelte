<script lang="ts">
  export let type = 'button';
  export let href = '';

  const tag = href ? 'a' : 'button';
</script>

<button
  class="font-title bg-gradient-to-b from-orange-300 to-orange-600 text-orange-50 border-radius py-3 px-6 rounded-full text-lg laptop:text-2xl shadow-md"
  {type}
  on:click
>
  <slot />
</button>
