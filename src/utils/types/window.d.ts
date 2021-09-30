import type { SvelteComponent } from "svelte/internal";

export interface Popup {
  id: string;
  component: SvelteComponent;
}