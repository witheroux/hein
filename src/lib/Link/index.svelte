<script lang="ts">
  export let href;
  export let selected = false;

  let color = "text-transparent";
  let hover = "hover:underline";

  if (selected) {
    color = "text-orange-50";
    hover = "";
  }
</script>

<a {href} on:click class="text-orange-600 no-underline {hover}">
  <span
    class="bg-clip-text font-bold {color} bg-gradient-to-b from-orange-300 to-orange-600"
  >
    <slot />
  </span>
</a>
