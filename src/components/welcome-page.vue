<template>
  <div class="welcome">Welcome to Vue + Kintone Customization <span class="confetti">🐝</span></div>
</template>
<script setup></script>

<style scoped>
.welcome {
  font-family: sans-serif;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
}

.confetti {
  font-size: 4rem;
  padding: 0.7rem;
  display: inline-block;
  animation: confetti 1s ease-in-out infinite alternate;
}

@keyframes confetti {
  from {
    transform: rotate(20deg) scale(1.05);
  }
  to {
    transform: rotate(40deg) scale(1);
  }
}
</style>
