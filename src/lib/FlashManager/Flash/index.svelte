<script lang="ts">
  export let type: 'success' | 'error' | 'info' | 'warning';
  export let message: string;

  let bg: string;

  switch (type) {
    case 'success':
      bg = 'bg-green-500';
      break;
    case 'error':
      bg = 'bg-red-500';
      break;
    case 'info':
      bg = 'bg-blue-500';
      break;
    case 'warning':
      bg = 'bg-yellow-400';
      break;
  }
</script>

<div class="text-center font-text font-semibold p-4 text-gray-900 {bg}">
  {message}
</div>
