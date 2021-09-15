<script lang="ts">

</script>

<article class="bg-gray-100 rounded-lg shadow-md text-center">
  {#if $$slots.top}
    <div class="p-8 border-t border-gray-300">
      <slot name="top"></slot>
    </div>
  {/if}
  <div class="p-8">
    <slot></slot>
  </div>
  {#if $$slots.bottom}
    <div class="p-8 border-t border-gray-300">
      <slot name="bottom"></slot>
    </div>
  {/if}
</article>