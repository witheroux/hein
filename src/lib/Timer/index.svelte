<script lang="ts">
  import Button from '$lib/Button/index.svelte';
  import hourglassIcon from '$lib/icons/hourglass.svg';
  import alarm from './alarm.mp3';

  let isStarted = false;
  let time = 60;
  let interval;
  let audio: HTMLAudioElement | undefined;

  $: timeString = `${Math.floor(time / 60)}:${('' + (time % 60)).padStart(2, '0')}`;
  function toggleTimer() {
    isStarted = !isStarted;

    if (isStarted) {
      time = 60;
      interval = setInterval(updateTimer, 1000);
      return;
    }

    if (audio) {
      audio.pause();
    }
    clearInterval(interval);
  }

  function updateTimer() {
    time -= 1;

    if (time > 0) return;

    if (audio) {
      audio.volume = 0.5;
      audio.currentTime = 0;
      audio.loop = true;
      audio.play();
    }

    clearInterval(interval);
  }
</script>

<div class="flex flex-col items-center">
  <Button on:click={toggleTimer}>
    {isStarted ? 'Arrêter le sablier' : 'Démarrer le sablier'}
  </Button>

  <p class="font-title text-2xl text-gray-300 mt-12">Temps restant</p>
  <div class="flex items-center text-orange-600">
    {@html hourglassIcon}
    <p class="font-title text-gray-100 text-5xl mb-2 ml-4">
      {isStarted ? timeString : '-:--'}
    </p>
  </div>
</div>

<!-- Disabled A11Y as this is just an alarm sound, doesn't need any description -->
<!-- svelte-ignore a11y-media-has-caption -->
<audio aria-hidden class="hidden" src={alarm} bind:this={audio} />

<style lang="postcss">
  div :global(svg) {
    width: 36px;
    height: 36px;
    fill: currentColor;
  }
</style>
