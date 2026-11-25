<script setup>
const dark = useState('dark', () => false)
</script>

<template>
  <div :class="['app', { dark }]">
    <AppNav />

    <SignedIn>
      <main class="auth-main">
        <div class="auth-card">
          <p class="auth-subtitle">You're already signed in.</p>
          <NuxtLink to="/" class="btn-primary">Go home</NuxtLink>
        </div>
      </main>
    </SignedIn>

    <SignedOut>
      <main class="auth-main">
        <SignUp after-sign-up-url="/" />
      </main>
    </SignedOut>
  </div>
</template>
