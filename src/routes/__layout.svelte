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

  import { USER_CONTEXT_KEY } from '$utils/constants/contexts';

  import '../app.css';

  export let logged;
  export let name;
  export let uuid;
  export let id;

  setContext(USER_CONTEXT_KEY, { logged, name, uuid, id });
</script>

<div class="bg-purple-700 h-screen tablet:grid tablet:grid-cols-12">
  <Header className="col-start-1 col-end-4" />

  <main class="col-start-5 col-end-13" style="background: rgba(0,0,0,0.5)">
    <slot />
  </main>
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
