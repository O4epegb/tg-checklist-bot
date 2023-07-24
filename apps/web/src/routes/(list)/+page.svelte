<script lang="ts">
  import { onMount } from 'svelte'
  import { flip } from 'svelte/animate'
  import { scale } from 'svelte/transition'
  // import welcome from '$lib/images/svelte-welcome.webp';
  // import welcome_fallback from '$lib/images/svelte-welcome.png';
  import type { PageData } from './$types'
  // import { WebApp } from '@grammyjs/web-app'
  import { browser } from '$app/environment'
  import { createStack } from '$lib/createStack'

  export let data: PageData

  let list: { text: string; isChecked: boolean }[] = data.list.map((item) => ({
    text: item,
    isChecked: false,
  }))

  let counter: number = 0

  const stack = createStack(list)

  onMount(() => {
    const x = Number(localStorage.getItem('test') ?? '0')
    counter = x
    localStorage.setItem('test', String(x + 1))
  })
</script>

<svelte:head>
  <title>List</title>
  <meta name="description" content="List page" />
</svelte:head>

<section>
  <h1>Hello there {counter}</h1>

  {#if browser}
    <div>
      <!-- {window.Telegram.WebApp.initData} -->
    </div>
  {/if}

  <div>
    <button
      type="button"
      class="button"
      disabled={$stack.first}
      on:click={() => (list = stack.undo())}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        width="20"
        height="20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <button
      type="button"
      class="button"
      disabled={$stack.last}
      on:click={() => (list = stack.redo())}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        width="20"
        height="20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M12.207 2.232a.75.75 0 00.025 1.06l4.146 3.958H6.375a5.375 5.375 0 000 10.75H9.25a.75.75 0 000-1.5H6.375a3.875 3.875 0 010-7.75h10.003l-4.146 3.957a.75.75 0 001.036 1.085l5.5-5.25a.75.75 0 000-1.085l-5.5-5.25a.75.75 0 00-1.06.025z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <button type="button" class="button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        width="20"
        height="20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>

  <div>
    {#each list as item, index (item.text)}
      <div transition:scale animate:flip={{ duration: 150 }}>
        <input
          id={`checkbox-${index}`}
          type="checkbox"
          checked={item.isChecked}
          on:change={(e) => {
            list = stack.push(
              list
                .map((x) => (x !== item ? x : { ...x, isChecked: e.currentTarget.checked }))
                .sort((a, b) => (a.isChecked === b.isChecked ? 0 : a.isChecked ? 1 : -1)),
            )
          }}
        />
        <label for={`checkbox-${index}`}>
          {item.text}
        </label>
        <button
          type="button"
          on:click={() => {
            list = stack.push(list.filter((x) => x !== item))
          }}
        >
          <svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    {/each}
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  h1 {
    width: 100%;
  }
</style>
