<script context="module" lang="ts">
  import type { ErrorLoadInput, LoadOutput } from '@sveltejs/kit/types/page';
  import type { Rec } from '@sveltejs/kit/types/helper';
  import type { Session } from '$utils/types/request';

  export async function load({ error, status }: ErrorLoadInput<Rec<string>, Rec<string>, Session>): Promise<LoadOutput> {
    return {
      props: {
        error,
        status,
      }
    };
  }
</script>

<script lang="ts">
  export let error: Error;
  export let status: number;
</script>

<h1>UH OH!</h1>
<p>Error {status}</p>

<code>
  {error.stack}
</code>
