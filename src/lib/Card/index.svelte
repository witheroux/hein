<script lang="ts">
  export let title;
  export let href = '';
</script>

<article class="bg-gray-100 rounded-lg flex flex-col relative shadow-lg">
  <a {href} class="px-5 py-4">
    {title}
  </a>
  <slot/>
</article>