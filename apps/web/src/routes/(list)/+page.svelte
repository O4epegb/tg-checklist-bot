<script lang="ts">
  import { onMount } from 'svelte'
  import { flip } from 'svelte/animate'
  import { fly, scale } from 'svelte/transition'
  import { createStack } from '$lib/createStack'
  import { createHash } from '$lib/utils'
  import { writable } from 'svelte/store'
  import Modal from './Modal.svelte'
  import Dev from './Dev.svelte'
  // import welcome from '$lib/images/svelte-welcome.webp';
  // import welcome_fallback from '$lib/images/svelte-welcome.png';

  type Item = {
    id: string
    text: string
    isChecked: boolean
  }
  type Items = Item[]
  type List = {
    id: string
    name: string
    items: Items
  }

  let isMenuOpen = false

  let itemToEdit: null | Item = null

  const state = writable<List>({
    id: '',
    name: 'Untitled list',
    items: [],
  })
  let stack = createStack($state.items)

  onMount(() => {
    const queryList = new URLSearchParams(window.location.search).get('q')

    if (!queryList) {
      return
    }

    const listId = createHash(queryList ?? '')
    const storageKey = `list-${listId}`
    const listFromStorage: List | null = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    const numberOfLists = Object.keys(localStorage).filter((key) => key.startsWith('list-')).length

    if (listFromStorage) {
      state.set(listFromStorage)
      stack = createStack(listFromStorage.items)
    } else {
      const rawItemTexts = (queryList ?? '')
        .split('\n')
        .map((item) => item.trim().replace(/^[-◦*●▪•+▸▹]+/, ''))
        .filter(Boolean)

      $state.name = `List #${numberOfLists + 1}`
      $state.id = listId
      $state.items = rawItemTexts.map((text, index) => ({
        id: String(index),
        text,
        isChecked: false,
      }))
      stack = createStack($state.items)
    }

    state.subscribe((data) => {
      console.log('data', data)
      localStorage.setItem(storageKey, JSON.stringify(data))
    })
  })

  const editItemText = (text: string, id: string) => {
    $state.items = stack.push($state.items.map((x) => (x.id !== id ? x : { ...x, text })))
  }
</script>

<svelte:head>
  <title>List</title>
  <meta name="description" content="List page" />
</svelte:head>

<h1>checklistbot</h1>

<Dev
  on:click={() => {
    $state.items = stack.push([
      { id: `${Math.random()}`, text: `New item ${Math.random()}`, isChecked: false },
      ...$state.items,
    ])
  }}
/>

<section>
  <input placeholder="Untitled list..." type="text" class="name" bind:value={$state.name} />

  <div class="list">
    {#each $state.items as item, index (item.id)}
      <div class="item" transition:scale animate:flip={{ duration: 250 }}>
        <button
          type="button"
          class="item-button"
          on:click={(e) => {
            e.stopPropagation()
            $state.items = stack.push($state.items.filter((x) => x !== item))
          }}
        >
          <svg
            width="16"
            height="16"
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
        <button
          type="button"
          class="item-button"
          on:click={() => {
            itemToEdit = { ...item }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            width="16"
            height="16"
          >
            <path
              d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"
            />
            <path
              d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"
            />
          </svg>
        </button>
        <label for={`checkbox-${index}`}>
          <span class="item-name">
            {item.text}
          </span>
          <input
            id={`checkbox-${index}`}
            class="checkbox"
            type="checkbox"
            checked={item.isChecked}
            on:change={(e) => {
              $state.items = stack.push(
                $state.items
                  .map((x) => (x !== item ? x : { ...x, isChecked: e.currentTarget.checked }))
                  .sort((a, b) => (a.isChecked === b.isChecked ? 0 : a.isChecked ? 1 : -1)),
              )
            }}
          />
        </label>
      </div>
    {/each}
  </div>

  <Modal show={Boolean(itemToEdit)} on:close={() => (itemToEdit = null)}>
    {#if itemToEdit}
      <!-- svelte-ignore a11y-autofocus -->

      <div class="item-modal">
        <textarea
          autofocus
          rows="3"
          class="name-input"
          value={itemToEdit.text}
          on:input={(e) => {
            if (itemToEdit) {
              itemToEdit.text = e.currentTarget.value
            }
          }}
          on:keydown={(e) => {
            if (e.key === 'Enter' && itemToEdit) {
              editItemText(itemToEdit.text, itemToEdit.id)
              itemToEdit = null
            }
            if (e.key === 'Escape') {
              itemToEdit = null
            }
          }}
        />

        <button
          type="button"
          class="button"
          on:click={() => {
            if (itemToEdit) {
              editItemText(itemToEdit.text, itemToEdit.id)
              itemToEdit = null
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    {/if}
  </Modal>

  {#if isMenuOpen}
    <nav
      transition:fly={{
        duration: 200,
        x: -250,
      }}
    >
      Menu
      <div>WIP</div>
    </nav>
  {/if}

  <div class="sticky">
    <button
      type="button"
      class="button menu"
      on:click={() => {
        isMenuOpen = !isMenuOpen
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        width="20"
        height="20"
      >
        <path
          fill-rule="evenodd"
          d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <button
      type="button"
      class="button"
      on:click={() => {
        //
      }}
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
          d="M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    {#each ['undo'].filter(Boolean) as item (item)}
      <!-- !$stack.last && 'redo' -->
      <button
        transition:scale
        animate:flip={{ duration: 150 }}
        type="button"
        class="button"
        disabled={item === 'undo' ? $stack.first : $stack.last}
        on:click={() => {
          $state.items = item === 'undo' ? stack.undo() : stack.redo()
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          width="20"
          height="20"
          fill="currentColor"
        >
          {#if item === 'undo'}
            <path
              fill-rule="evenodd"
              d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z"
              clip-rule="evenodd"
            />
          {/if}
          {#if item === 'redo'}
            <path
              fill-rule="evenodd"
              d="M12.207 2.232a.75.75 0 00.025 1.06l4.146 3.958H6.375a5.375 5.375 0 000 10.75H9.25a.75.75 0 000-1.5H6.375a3.875 3.875 0 010-7.75h10.003l-4.146 3.957a.75.75 0 001.036 1.085l5.5-5.25a.75.75 0 000-1.085l-5.5-5.25a.75.75 0 00-1.06.025z"
              clip-rule="evenodd"
            />
          {/if}
        </svg>
      </button>
    {/each}
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 0.6;
    gap: 1rem;
  }

  h1 {
    margin-top: 0;
  }

  .sticky {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: var(--light-background-color);
    border-top: 1px solid rgb(from var(--tg-theme-text-color) r g b / 30%);
  }

  .item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .item-button {
    padding: 0.3rem;
    flex-shrink: 0;
    line-height: 1;
    background-color: rgb(from var(--tg-theme-button-color) r g b / 0.2);
    border-radius: calc(var(--radius) - 2px);
  }

  .checkbox {
    margin-left: auto;
    flex-shrink: 0;
  }

  .list {
    padding-bottom: 3rem;
  }

  .name {
    font-size: 1.5rem;
    font-weight: 500;
    padding: 0.5rem;
    border: 0;
    border-bottom: 1px solid rgb(from var(--tg-theme-text-color) r g b / 30%);
    background-color: transparent;
    color: var(--tg-theme-text-color);
    outline: none;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    padding: 0.6rem 0;
  }

  .item-name {
    flex: 1;
    font-size: 1.1rem;
    word-break: break-word;
  }

  nav {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: var(--light-background-color);
  }

  .item-modal {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .name-input {
    flex: 1;
    font-size: 1.5rem;
    font-weight: 500;
    padding: 0.5rem;
    border: 0;
    border-bottom: 1px solid rgb(from var(--tg-theme-text-color) r g b / 30%);
    background-color: transparent;
    color: var(--tg-theme-text-color);
    outline: none;
    min-width: 0;
    resize: none;
  }
</style>
