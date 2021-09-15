<script lang="ts">
  export let category: string = '';
  export let card: string = '';
</script>

<article
  class="bg-gradient-to-b from-purple-300 to-purple-700 rounded-2xl p-3 tablet:p-4 w-full max-w-xs shadow-md"
>
  <div class="bg-purple-100 rounded-xl p-3 tablet:p-4">
    <p class="font-title text-center text-xl tablet:text-2xl text-purple-700 mb-2">
      {category}
    </p>
    {#if card}
      <div
        class="flex items-center justify-center bg-gray-100 rounded-6xl min-h-16 py-2 px-3 tablet:py-3 tablet:px-4 w-full"
      >
        <p class="font-text text-md tablet:text-lg">
          {card}
        </p>
      </div>
    {/if}
  </div>
</article>
