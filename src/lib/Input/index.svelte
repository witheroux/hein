<script lang="ts">
  export let label: string;
  export let name: string;
  export let id: string;
  export let value: string = "";
  export let checked: boolean = false;
  export let placeholder: string = "";
  export let type: string = "text";
</script>

<label for={id} class="flex flex-col items-start w-full mb-5">
  <span class="text-sm mb-1.5 font-semibold">{label}</span>
  <input 
    class="bg-white rounded-lg px-4 py-2.5 border border-color-gray-200 w-full"
    {type} 
    {id} 
    {name} 
    {value} 
    {checked} 
    {placeholder}
  />
</label>