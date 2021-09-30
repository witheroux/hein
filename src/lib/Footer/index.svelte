<script lang="ts">
  import AuthMenu from '$lib/AuthMenu/index.svelte';

  export let onClickLink: () => void;
</script>

<footer>
  <AuthMenu {onClickLink}/>
  <p class="mt-4 font-text text-xs text-gray-100">Développé avec ❤️ par William © 2021</p>
</footer>

<!-- 
<div>
  Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from
  <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
</div> -->
