<script lang="ts">
  export let label: string;
  export let name: string;
  export let id: string;
  export let value: string = "";
  export let checked: boolean = false;
  export let placeholder: string = "";
  export let type: string = "text";
</script>

<label for={id}>
  <span>{label}</span>
  <input {type} {id} {name} {value} {checked} {placeholder}/>
</label>