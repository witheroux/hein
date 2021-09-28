<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/page';
  import type { Rec } from '@sveltejs/kit/types/helper';
  import type { Flash, Session } from '$utils/types/request';

  export async function load({ session }: LoadInput<Rec<string>, Rec<string>, Session>): Promise<LoadOutput> {
    const { user, flash } = session;
    const { name, uuid, id } = user || {};

    return {
      props: {
        logged: !!uuid,
        name,
        uuid,
        id,
        flash,
      }
    };
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte';

  import Header from '$lib/Header/index.svelte';
  import FlashManager from '$lib/FlashManager/index.svelte';
  // import WindowManager from '$lib/WindowManager/index.svelte';

  import { USER_CONTEXT_KEY } from '$utils/constants/contexts';

  import '../app.css';

  export let logged: boolean;
  export let name: string;
  export let uuid: string;
  export let id: string;
  export let flash: Flash[];

  setContext(USER_CONTEXT_KEY, { logged, name, uuid, id });
</script>

<FlashManager {flash}>
  <!-- <WindowManager/> -->
  <div
    class="bg-gradient-to-b from-purple-300 via-purple-700 to-purple-700 h-screen tablet:grid tablet:grid-cols-game overflow-hidden "
  >
    <div class="flex fixed tablet:static overflow-y-auto">
      <Header />
    </div>
  
    <main
      class="overflow-y-auto tablet:flex items-center justify-center pt-32 tablet:p-4 h-full tablet:h-auto tablet:bg-gray-700 tablet:bg-opacity-50"
    >
      <div class="m-auto">
        <slot />
      </div>
    </main>
  </div>
</FlashManager>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
