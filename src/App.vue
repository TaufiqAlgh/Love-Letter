<script setup>
import { ref } from 'vue'
import LandingPage from './components/landing-page.vue'
import Welcome from './components/welcome-page.vue'

// Component state
const showGallery = ref(false)

// Handle transition to gallery
const enterGallery = () => {
  showGallery.value = true
}

// Handle back to landing (optional)
const backToLanding = () => {
  showGallery.value = false
}
</script>

<template>
  <div id="app">
    <!-- Transition between components -->
    <Transition name="love-transition" mode="out-in" appear>
      <LandingPage v-if="!showGallery" @enter-gallery="enterGallery" key="landing" />
      <Welcome v-else @back-to-landing="backToLanding" key="gallery" />
    </Transition>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  margin: 0;
  padding: 0;
}

/* Love Transition Animations */
.love-transition-enter-active {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.love-transition-leave-active {
  transition: all 0.6s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.love-transition-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(50px);
}

.love-transition-leave-to {
  opacity: 0;
  transform: scale(1.1) translateY(-30px);
}

.love-transition-enter-to,
.love-transition-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Additional romantic effects during transition */
.love-transition-enter-active::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255, 107, 157, 0.3) 0%, transparent 70%);
  pointer-events: none;
  z-index: 9999;
  animation: loveGlow 0.8s ease-out;
}

@keyframes loveGlow {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
