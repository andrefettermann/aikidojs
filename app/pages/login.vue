<template>
  <div class="container w-75 pt-5">
    <form @submit.prevent="login">
      
      <input v-model="credentials.email" type="email" placeholder="Email"
      class="form-control mb-3">
      
      <input v-model="credentials.password" type="password" placeholder="Senha"
      class="form-control">

      <button type="submit" class="btn btn-lg btn-primary btn-block mt-4 btn-sm">Login</button>
  </form>
  </div>
</template>

<script setup lang="ts">
  const { loggedIn, user, fetch: refreshSession } = useUserSession()
  const credentials = reactive({
    email: '',
    password: '',
  })

  async function login () {
    try {
      await $fetch('/api/login', {
        method: 'POST',
        body: credentials,
      })

      // Refresh the session on client-side and redirect to the home page
      await refreshSession()
      await navigateTo('/pessoas/lista_pessoas', { replace: true });
      await reloadNuxtApp();
    } catch {
      alert('Bad credentials')
    }
  }
</script>

