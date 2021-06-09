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

<div class="bg-purple-700 h-screen tablet:grid tablet:grid-cols-game overflow-hidden">
  <Header className="overflow-y-auto" />

  <main
    class="overflow-y-auto flex items-center justify-center p-4 tablet:bg-gray-700 tablet:bg-opacity-50"
  >
    <slot />
  </main>
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
