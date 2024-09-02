<script>
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'

  export let show = false

  const dispatch = createEventDispatcher()
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

{#if show}
  <div
    data-close
    class="overlay"
    transition:fade={{ duration: 150 }}
    on:click={(e) => {
      if (e.target instanceof HTMLDivElement && 'close' in e.target.dataset) {
        show = false
        dispatch('close')
      }
    }}
  >
    <div class="content">
      <slot />
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: rgb(from var(--tg-theme-bg-color) r g b / 0.7);
    z-index: 10;
  }
  .content {
    position: relative;
    width: 90vw;
    max-width: 600px;
    margin: 1rem auto;
    padding: 1rem;
    background-color: var(--light-background-color);
  }
</style>
