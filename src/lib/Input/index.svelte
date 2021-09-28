<script lang="ts">
import { onDestroy, onMount } from "svelte";


  export let label: string;
  export let name: string;
  export let id: string;
  export let required: boolean = false;
  export let value: string = "";
  export let checked: boolean = false;
  export let placeholder: string = undefined;
  export let type: string = "text";
  export let minlength: number = undefined;
  export let maxlength: number = undefined;
  export let pattern: string = undefined;
  export let patternErrorMessage: string = "";
  export let hint: string = "";
  
  let errors: string[] = [];
  let input: HTMLInputElement;

  $: border = errors.length
    ? "border-color-red-500"
    : "border-color-gray-200";

  const validate = (e: InputEvent) => {
    e.preventDefault();

    errors = [];

    if (input.validity.valid) return;

    if (input.validity.valueMissing) {
      errors.push('Ce champs est requis.');
    }

    if (input.validity.tooLong) {
      errors.push(`Le champ a une longueur maximale de ${maxlength} caractères.`);
    }

    if (input.validity.tooShort) {
      errors.push(`Le champ a une longueur minimale de ${minlength} caractères.`);
    }

    if (input.validity.badInput || input.validity.patternMismatch || input.validity.typeMismatch) {
      errors.push(patternErrorMessage || 'Champs invalide.');
    }

    input.setCustomValidity(errors[0]);
  };

  onMount(() => {
    if (input) {
      input.addEventListener('input', validate);
      input.addEventListener('invalid', validate);
    }
  });

  onDestroy(() => {
    if (input) {
      input.removeEventListener('input', validate);
      input.removeEventListener('invalid', validate);
    }
  });
</script>

<label for={id} class="flex flex-col items-start w-full mb-5">
  <span class="text-sm mb-1.5 font-semibold">{label}</span>
  <input 
    bind:this={input}
    class="bg-white rounded-lg px-4 py-2.5 border {border} w-full"
    {type} 
    {id} 
    {name} 
    {value} 
    {checked} 
    {required}
    aria-required={required}
    {placeholder}
    {minlength}
    {maxlength}
    {pattern}
  />
  {#if hint}
    <span class="text-xs text-gray-500 mt-1">{hint}</span>
  {/if}
  {#if errors.length}
    <span class="text-xs text-red-500">{errors[0]}</span>
  {/if}
</label>