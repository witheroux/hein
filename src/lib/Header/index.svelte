<script lang="ts">
  import logo from './logo.png';

  import HiddenText from '$lib/HiddenText/index.svelte';
  import Menu from '$lib/Menu/index.svelte';
  import Footer from '$lib/Footer/index.svelte';

  export let className;

  let toggled = false;
</script>

<header class="flex flex-col align-start w-full p-8 pt-0 {className}">
  <div class="w-100 text-center sticky top-0">
    <button type="button" class="tablet:hidden">
      <HiddenText>
        {toggled ? 'Fermer le menu' : 'Ouvrir le menu'}
      </HiddenText>
    </button>
    <a href="/">
      <img src={logo} alt="Hein?" />
    </a>
  </div>
  <nav class="flex flex-col h-full justify-between">
    <Menu />
    <Footer />
  </nav>
</header>

<style lang="postcss">
  header {
    min-width: 300px;
  }
  img {
    width: 269px;
    height: 115px;
  }
</style>
