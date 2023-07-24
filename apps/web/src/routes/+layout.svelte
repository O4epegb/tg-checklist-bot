<script>
  import { onMount } from 'svelte'
  import './styles.css'

  onMount(() => {
    window.Telegram?.WebApp.ready()
  })
</script>

<slot />

<style>
</style>
