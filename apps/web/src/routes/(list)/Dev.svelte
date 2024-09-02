<script>
  import { dev } from '$app/environment'
</script>

{#if dev}
  <div class="dev">
    <button
      class="dev-button"
      on:click={() => {
        window.location.search = `q=${encodeURIComponent(
          Array.from({ length: 10 }, () => `item ${Math.random()}`).join('\n'),
        )}`
      }}
    >
      @
    </button>
    <button class="dev-button" on:click> + </button>
  </div>
{/if}

<style>
  .dev {
    position: fixed;
    right: 0;
    top: 0;
  }

  .dev-button {
    padding: 0.5rem;
    line-height: 1;
  }
</style>
