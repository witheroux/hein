<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/page';

  export async function load({ session }: LoadInput): Promise<LoadOutput> {
    const { user } = session;
    const { name, uuid, id } = user;

    return {
      props: {
        logged: !!uuid,
        name,
        uuid,
        id
      }
    };
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte';

  import Header from '$lib/Header/index.svelte';
  import Sidebar from '$lib/Sidebar/index.svelte';

  import { USER_CONTEXT_KEY } from '$utils/constants/contexts';

  import '../app.css';

  export let logged;
  export let name;
  export let uuid;
  export let id;

  setContext(USER_CONTEXT_KEY, { logged, name, uuid, id });
</script>

<Header />

<div>
  <main>
    <slot />
  </main>
  <Sidebar />
</div>

<footer>Développé avec ❤️ par William © 2021</footer>

<style lang="postcss">
</style>
