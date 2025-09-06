<template>
  <div class="landing-page">
    <!-- Floating Hearts Background -->
    <div class="hearts-background">
      <div
        v-for="heart in backgroundHearts"
        :key="heart.id"
        class="floating-heart"
        :style="{
          left: heart.left + '%',
          animationDelay: heart.delay + 's',
          animationDuration: heart.duration + 's',
          fontSize: heart.size + 'rem',
        }"
      >
        💖
      </div>
    </div>

    <!-- Main Content -->
    <div class="landing-content">
      <div class="romantic-title">
        <h1 class="main-title">
          <span
            class="letter"
            v-for="(letter, index) in titleLetters"
            :key="index"
            :style="{ animationDelay: index * 0.1 + 's' }"
          >
            {{ letter }}
          </span>
        </h1>
        <p class="subtitle">A Journey Through Our Love Story</p>
      </div>

      <!-- Romantic Button -->
      <div class="button-container">
        <button
          class="romantic-button"
          @click="enterLoveGallery"
          @mouseenter="buttonHover = true"
          @mouseleave="buttonHover = false"
        >
          <span class="button-content">
            <span class="button-text">Click me</span>
            <span class="heart-emoji" :class="{ beating: buttonHover }">💖</span>
          </span>
          <div class="button-glow"></div>
        </button>
      </div>

      <!-- Romantic Quote -->
      <div class="romantic-quote">
        <p>"Every love story is beautiful, but ours is my favorite"</p>
      </div>
    </div>

    <!-- Sparkles Effect -->
    <div class="sparkles">
      <div
        v-for="sparkle in sparkles"
        :key="sparkle.id"
        class="sparkle"
        :style="{
          left: sparkle.left + '%',
          top: sparkle.top + '%',
          animationDelay: sparkle.delay + 's',
        }"
      >
        ✨
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Define emits for parent component
const emit = defineEmits(['enter-gallery'])

// Component state
const buttonHover = ref(false)
const backgroundHearts = ref([])
const sparkles = ref([])

// Title animation
const titleLetters = ref('Welcome to Our Love Gallery'.split(''))

// Generate floating hearts
const generateBackgroundHearts = () => {
  backgroundHearts.value = []
  for (let i = 0; i < 20; i++) {
    backgroundHearts.value.push({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 4,
      size: 1.5 + Math.random() * 1,
    })
  }
}

// Generate sparkles
const generateSparkles = () => {
  sparkles.value = []
  for (let i = 0; i < 15; i++) {
    sparkles.value.push({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    })
  }
}

// Button click handler
const enterLoveGallery = () => {
  emit('enter-gallery')
}

// Lifecycle
onMounted(() => {
  generateBackgroundHearts()
  generateSparkles()
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fad0c4 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Arial', sans-serif;
}

/* Floating Hearts Background */
.hearts-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-heart {
  position: absolute;
  top: -50px;
  opacity: 0.6;
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Sparkles */
.sparkles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.sparkle {
  position: absolute;
  font-size: 1.2rem;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Main Content */
.landing-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
  max-width: 600px;
}

/* Romantic Title */
.romantic-title {
  margin-bottom: 3rem;
}

.main-title {
  font-size: 3rem;
  color: #fff;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
  font-weight: bold;
  line-height: 1.2;
}

.letter {
  display: inline-block;
  animation: letterDrop 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(-50px);
}

@keyframes letterDrop {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  font-style: italic;
  margin: 0;
  animation: fadeInUp 1s ease-out 0.5s forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Romantic Button */
.button-container {
  margin: 3rem 0;
  animation: fadeInScale 1s ease-out 1s forwards;
  opacity: 0;
  transform: scale(0.8);
}

@keyframes fadeInScale {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.romantic-button {
  position: relative;
  background: linear-gradient(45deg, #ff6b9d, #ff9a9e);
  border: none;
  border-radius: 50px;
  padding: 1.2rem 3rem;
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4);
  overflow: hidden;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.romantic-button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 12px 35px rgba(255, 107, 157, 0.6);
}

.romantic-button:active {
  transform: translateY(-2px) scale(1.02);
}

.button-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  justify-content: center;
}

.button-text {
  font-family: 'Georgia', serif;
}

.heart-emoji {
  font-size: 1.6rem;
  transition: transform 0.3s ease;
}

.heart-emoji.beating {
  animation: heartBeat 0.6s ease-in-out infinite;
}

@keyframes heartBeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.romantic-button:hover .button-glow {
  left: 100%;
}

/* Romantic Quote */
.romantic-quote {
  animation: fadeIn 1s ease-out 1.5s forwards;
  opacity: 0;
}

.romantic-quote p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  margin: 0;
  font-family: 'Georgia', serif;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .romantic-button {
    font-size: 1.2rem;
    padding: 1rem 2.5rem;
  }

  .landing-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.6rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .romantic-button {
    font-size: 1.1rem;
    padding: 0.9rem 2rem;
  }
}
</style>
