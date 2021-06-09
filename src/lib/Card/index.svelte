<script lang="ts">
  export let category: string = '';
  export let card: string = '';
</script>

<article
  class="bg-gradient-to-b from-purple-300 to-purple-700 rounded-2xl p-4 w-full max-w-xs shadow-md"
>
  <div class="bg-purple-100 rounded-xl p-4">
    <p class="font-title text-center text-2xl text-purple-700 mb-2">
      {category}
    </p>
    <div class="flex items-center justify-center bg-gray-100 rounded-6xl min-h-16 py-3 px-4 w-full">
      <p class="font-text text-lg">
        {card}
      </p>
    </div>
  </div>
</article>
