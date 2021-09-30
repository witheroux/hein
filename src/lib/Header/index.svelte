<script lang="ts">
  import { fly } from 'svelte/transition';
  import { quadInOut } from 'svelte/easing';

  import logo from './logo.png';

  import Menu from '$lib/Menu/index.svelte';
  import MenuButton from '$lib/MenuButton/index.svelte';
  import Footer from '$lib/Footer/index.svelte';

  let toggled = false;
  let width = 1280;
  let isMobile = false;

  $: isMobile = width < 640;

  const toggleMenu = () => toggled = !toggled;
  const closeMenu = () => toggled = false;
</script>

<svelte:window bind:innerWidth={width} />

<header
  class="flex flex-col align-start w-full tablet:bg-none shadow-none tablet:shadow-xl"
>
  <div
    class="w-full h-full tablet:h-auto text-center flex items-center sticky top-0 z-10 px-8 flex-shrink-0 duration-75"
    class:delay-300={toggled && isMobile}
    class:bg-gray-700={toggled && isMobile}
    class:transition={toggled && isMobile}
  >
    <span class="flex-shrink-0 relative z-10">
      <MenuButton
        {toggled}
        on:click={toggleMenu}
      />
    </span>
    <a
      href="/"
      class="fixed left-1/2 transform -translate-x-1/2 tablet:transform-none tablet:static"
    >
      <img class="max-w-full h-auto mx-auto block" src={logo} alt="Hein?" />
    </a>
  </div>
  {#if toggled || !isMobile}
    <nav
      transition:fly={{
        duration: isMobile ? 250 : 0,
        opacity: 1,
        x: -width,
        y: 0,
        easing: quadInOut
      }}
      class="flex flex-col fixed bg-gray-700 tablet:bg-transparent tablet:static pt-40 p-8 tablet:pt-8 left-0 top-0 bottom-0 w-full tablet:w-auto h-full justify-between overflow-y-auto"
    >
      <Menu onClickLink={closeMenu} />
      <Footer onClickLink={closeMenu} />
    </nav>
  {/if}
</header>

<style lang="postcss">
  header {
    min-width: 300px;
  }

  header > div {
    height: 115px;
  }

  img {
    width: 250px;
  }
</style>
