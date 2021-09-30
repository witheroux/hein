<script lang="ts">
  export let type = 'button';
  export let href = '';
  export let isSmall = false;
  export let fullWidth = false;

  const tag = href ? 'a' : 'button';
  const fontSize = `text-lg ${isSmall ? '' : 'laptop:text-2xl'}`;
  const width = fullWidth ? 'w-full text-center' : '';
  const padding = isSmall ? 'py-2.5 px-8' : 'py-3 px-6' ;
</script>

<button
  class="font-title bg-gradient-to-b from-orange-300 to-orange-600 text-orange-50 {padding} rounded-full {fontSize} {width} shadow-md"
  {type}
  on:click
>
  <slot />
</button>
