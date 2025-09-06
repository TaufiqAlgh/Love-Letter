<template>
  <div class="app">
    <!-- Falling Hearts Background -->
    <div class="hearts-container">
      <div
        v-for="heart in hearts"
        :key="heart.id"
        class="falling-heart"
        :style="{
          left: heart.left + '%',
          animationDelay: heart.delay + 's',
          animationDuration: heart.duration + 's',
        }"
      >
        💖
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Audio Player (Google Drive) -->
      <div class="youtube-container">
        <div class="audio-player-wrapper">
          <div class="audio-player-info" @click="playAudio">
            <div class="music-icon" :class="{ playing: isPlaying }">
              {{ isPlaying ? '🎵' : '🎶' }}
            </div>
            <div class="music-text">
              <div class="music-title">
                {{ isPlaying ? 'Playing My Hopes' : 'Click to Play Music' }}
              </div>
              <div class="music-subtitle">Please Be Mine Forever</div>
            </div>
          </div>
          <audio
            ref="audioPlayer"
            controls
            loop
            preload="none"
            @play="isPlaying = true"
            @pause="isPlaying = false"
            @ended="isPlaying = false"
            @error="handleAudioError"
            @loadstart="() => console.log('Audio load started')"
            @canplay="() => console.log('Audio can play')"
            @loadeddata="() => console.log('Audio data loaded')"
            style="width: 100%; height: 80px; border-radius: 12px; opacity: 0.3"
          >
            <!-- Audio files served from public directory -->
            <source src="/audio.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>

      <h1 class="title">Love Gallery</h1>

      <!-- Photo Carousel -->
      <div class="carousel-container">
        <div
          class="carousel"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
        >
          <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div v-for="(photo, index) in photos" :key="index" class="carousel-slide">
              <div class="photo-frame">
                <img :src="photo.url" :alt="photo.alt" />
                <div class="photo-overlay">
                  <p>{{ photo.caption }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel Indicators -->
        <div class="carousel-indicators">
          <button
            v-for="(photo, index) in photos"
            :key="index"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></button>
        </div>
      </div>

      <!-- Live Countdown Timer -->
      <div class="countdown-container">
        <h2 class="countdown-title">I Have Loved You For</h2>
        <div class="countdown-timer">
          <div class="time-unit">
            <span class="time-value">{{ timeElapsed.days }}</span>
            <span class="time-label">Days</span>
          </div>
          <div class="time-unit">
            <span class="time-value">{{ timeElapsed.hours }}</span>
            <span class="time-label">Hours</span>
          </div>
          <div class="time-unit">
            <span class="time-value">{{ timeElapsed.minutes }}</span>
            <span class="time-label">Minutes</span>
          </div>
          <div class="time-unit">
            <span class="time-value">{{ timeElapsed.seconds }}</span>
            <span class="time-label">Seconds</span>
          </div>
        </div>
      </div>

      <!-- Romantic Typewriter Text -->
      <div class="romantic-text-container">
        <div class="typewriter-text">
          <span class="typed-text">{{ displayedText }}</span>
          <span class="cursor" :class="{ blinking: !isTyping }">|</span>
        </div>
      </div>

      <!-- Flower Blossom Animation (appears when typing is finished) -->
      <div v-if="!isTyping" class="flower-garden">
        <div class="flower-container">
          <div
            v-for="flower in flowers"
            :key="flower.id"
            class="flower"
            :style="{
              left: flower.left + '%',
              animationDelay: flower.delay + 's',
              animationDuration: flower.duration + 's',
            }"
          >
            <div class="flower-center">🌼</div>
            <div class="petal petal-1">🌸</div>
            <div class="petal petal-2">🌸</div>
            <div class="petal petal-3">🌸</div>
            <div class="petal petal-4">🌸</div>
            <div class="petal petal-5">🌸</div>
            <div class="petal petal-6">🌸</div>
          </div>
        </div>
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

      <!-- Navigation Arrows -->
      <button class="nav-btn prev" @click="prevSlide">❮</button>
      <button class="nav-btn next" @click="nextSlide">❯</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Carousel state
const currentSlide = ref(0)
const autoSlideInterval = ref(null)

// Touch/Swipe state for carousel
const touchStartX = ref(0)
const touchEndX = ref(0)
const isDragging = ref(false)
const minSwipeDistance = 50 // Minimum distance for a swipe

// Countdown state
const timeElapsed = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})
const countdownInterval = ref(null)

// Typewriter animation state
const displayedText = ref('')
const isTyping = ref(true)
const typewriterInterval = ref(null)
const currentMessageIndex = ref(0)
const currentCharIndex = ref(0)

// Audio player state
const audioPlayer = ref(null)
const isPlaying = ref(false)

// Romantic messages for typewriter animation - combined as one long text
const fullRomanticText = [
  'Sayangggggggggggg.... 💕',
  'Setiap detik bersamamu adalah keajaiban... ☀️',
  'Setiap moment yang dihabiskan bersamamu adalah kebahagiaan... 😆',
  'Setiap makanan yang dihabiskan bersamamu merupakan makanan yang paling enak... 🍽️',
  'Bersama kamu setiap hari adalah hari valentine... 💐',
  'Setiap malam bersama kamu adalah malam yang paling indah... 💓',
  'Bersama kita selalu membuat hal istimewa pada setiap hal yang biasa... ✨',
  'Di dunia dan negara yang penuh kekacauan, kamu adalah ketenanganku... 🕊️',
  'Cintaku selalu bertumbuh disetiap detik yang kulalui bersama kamu... 🌱',
  'Kamu rumahku, tempat aku merasa aman dan dicintai... 🏡',
  'tempatku kembali setelah hari yang panjang... 🛋️',
  'tempatku beristirahat dan merasa damai... 🕯️',
  'Kamu adalah mimpiku yang menjadi kenyataan... 🌈',
  'Kamu adalah anugerah terindah dalam hidupku... 🎁',
  'Kamu adalah segalanya bagiku... 🌍',
  'Kamu tujuan hidupku... 🎯',
  'Kamu motivasiku... 🚀',
  'Aku bersyukur setiap hari karena memilikimu... 🙏',
  'Aku mohon tetaplah menjadi milikku... 💞',
  'You are my always and forever... 💍',
  'I LOVE YOU... ❤️',
  'You Will Always Be My Sayang Forever... 🥰😚🫶🏻💋💝❤️🩷🧡💛💚🩵💙💙💜🤍🖤🩶🤎💕🍌🍓🌈💋👑💍🐧🐼🐘🏡👰🏻‍♀️',
].join(' ') // Join all messages into one continuous text

// Target date: January 22, 2025
const targetDate = new Date('2025-01-22T00:00:00')

// Sample photos (you can replace these with your own images)
const photos = ref([
  {
    url: 'https://lh3.googleusercontent.com/d/1LPmAfXe6ZnCS_XTBIGAgh1f75Wezigqr',
    alt: 'Beautiful sunset',
    caption: 'Our First Date After You Officially Be Mine 💕',
  },
  {
    url: 'https://lh3.googleusercontent.com/d/1cnttAcA2EpuHyEMlMm6zTVNfe2gE9Lm7',
    alt: 'Nature scene',
    caption: 'Our Aquarium Adventure 🌊',
  },
  {
    url: 'https://lh3.googleusercontent.com/d/15zYINioGOWAGhZGJO8OT5RAdeQ0c_QmO',
    alt: 'Ocean view',
    caption: 'First Photobooth Hope We Can Took Another Photobooth together 📸',
  },
  {
    url: 'https://lh3.googleusercontent.com/d/1qB-uOsZy4tz7rWmINoY-yMqwi0JF4yPa',
    alt: 'Forest path',
    caption: 'Seafood Date at Joglo 1001 Lampu Merah 🦞',
  },
  {
    url: 'https://lh3.googleusercontent.com/d/1035fnTDwnbvdFiYF6Yff1EME_qHln6f_',
    alt: 'Forest path',
    caption: 'A Long Awaited Bukber With Your Bestie 😎',
  },
  {
    url: 'https://lh3.googleusercontent.com/d/10H3OA3x9AKlxhqmf3IKz8aq6s5a6ZL5X',
    alt: 'Forest path',
    caption: 'MUKAAA SONGONGG KITAAA 💖😏',
  },
  {
    url: 'https://lh3.googleusercontent.com/d/1eLQ38Wd1vK8sBOa78ZfOTJo1dvR0hVup',
    alt: 'Forest path',
    caption: 'First Kondangan Together 🥰',
  },
  {
    url: 'https://lh3.googleusercontent.com/d/1oPuMBIhwND9OAAovd0pxN2BMaj6a4Gsx',
    alt: 'Forest path',
    caption: 'The First Time I Buy You Skincare And Makeup 💄',
  },
  {
    url: 'https://lh3.googleusercontent.com/d/1n7gyuNyrjPKOyyojvAeZxJPSHlA44nBm',
    alt: 'Forest path',
    caption: 'I Will Always Love You Forever And Ever 🫶🏻',
  },
])

// Falling hearts
const hearts = ref([])

// Flower blossom animation arrays
const flowers = ref([])
const sparkles = ref([])

// Generate random hearts
const generateHearts = () => {
  hearts.value = []
  for (let i = 0; i < 15; i++) {
    hearts.value.push({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    })
  }
}

// Generate flowers for blossom animation
const generateFlowers = () => {
  flowers.value = []
  for (let i = 0; i < 8; i++) {
    // More evenly distribute flowers across the width
    const basePosition = i * 12 + 5 // Each flower gets ~12% of width, starting at 5%
    const randomOffset = Math.random() * 6 - 3 // Add small random variation (-3% to +3%)
    const position = Math.max(2, Math.min(95, basePosition + randomOffset)) // Keep within 2-95%

    flowers.value.push({
      id: i,
      left: position,
      delay: i * 0.2, // Slightly faster stagger
      duration: 1.8 + Math.random() * 0.8, // 1.8-2.6 seconds duration
    })
  }
}

// Generate sparkles for magical effect
const generateSparkles = () => {
  sparkles.value = []
  for (let i = 0; i < 20; i++) {
    sparkles.value.push({
      id: i,
      left: Math.random() * 100,
      top: 80 + Math.random() * 20, // Bottom area of the page
      delay: Math.random() * 3,
    })
  }
}

// Countdown functions
const updateCountdown = () => {
  const now = new Date()
  const timeDifference = now - targetDate

  if (timeDifference > 0) {
    // Time has passed since the target date
    const totalSeconds = Math.floor(timeDifference / 1000)
    const days = Math.floor(totalSeconds / (24 * 60 * 60))
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
    const seconds = totalSeconds % 60

    timeElapsed.value = {
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    }
  } else {
    // Target date hasn't arrived yet
    const totalSeconds = Math.floor(Math.abs(timeDifference) / 1000)
    const days = Math.floor(totalSeconds / (24 * 60 * 60))
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
    const seconds = totalSeconds % 60

    timeElapsed.value = {
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    }
  }
}

// Typewriter animation functions
const typewriterEffect = () => {
  if (currentCharIndex.value < fullRomanticText.length) {
    // Continue typing the next character
    displayedText.value = fullRomanticText.substring(0, currentCharIndex.value + 1)
    currentCharIndex.value++
    isTyping.value = true

    // Variable typing speed for more natural feel
    // Slower speed for punctuation and spaces for more natural pauses
    let typingSpeed = 50
    const currentChar = fullRomanticText[currentCharIndex.value - 1]

    if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
      typingSpeed = 500 // Longer pause after sentences
    } else if (currentChar === ',' || currentChar === ';') {
      typingSpeed = 300 // Medium pause after commas
    } else if (currentChar === ' ') {
      typingSpeed = 100 // Short pause after words
    } else {
      typingSpeed = Math.random() * 100 + 30 // Variable speed for letters
    }

    typewriterInterval.value = setTimeout(typewriterEffect, typingSpeed)
  } else {
    // Finished typing all text, cursor stops blinking
    isTyping.value = false
    // Trigger flower blossom animation when typing is finished
    setTimeout(() => {
      generateFlowers()
      generateSparkles()
    }, 500) // Small delay for smooth transition
  }
}

const startTypewriter = () => {
  // Reset if needed and start typing
  currentCharIndex.value = 0
  displayedText.value = ''
  typewriterEffect()
}

const stopTypewriter = () => {
  if (typewriterInterval.value) {
    clearTimeout(typewriterInterval.value)
  }
}

const startCountdown = () => {
  updateCountdown() // Initial update
  countdownInterval.value = setInterval(updateCountdown, 1000)
}

const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
}

// Carousel functions
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % photos.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? photos.value.length - 1 : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// Auto slide functionality
const startAutoSlide = () => {
  autoSlideInterval.value = setInterval(nextSlide, 4000)
}

const stopAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value)
  }
}

// Touch/Swipe handling functions
const handleTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX
  isDragging.value = true
  stopAutoSlide() // Pause auto-slide during interaction
}

const handleTouchMove = (event) => {
  if (!isDragging.value) return
  event.preventDefault() // Prevent scrolling while swiping
}

const handleTouchEnd = (event) => {
  if (!isDragging.value) return

  touchEndX.value = event.changedTouches[0].clientX
  handleSwipe()
  isDragging.value = false
  startAutoSlide() // Resume auto-slide after interaction
}

// Mouse handling for desktop (drag to swipe)
const handleMouseDown = (event) => {
  touchStartX.value = event.clientX
  isDragging.value = true
  stopAutoSlide()
  event.preventDefault()
}

const handleMouseMove = (event) => {
  if (!isDragging.value) return
  event.preventDefault()
}

const handleMouseUp = (event) => {
  if (!isDragging.value) return

  touchEndX.value = event.clientX
  handleSwipe()
  isDragging.value = false
  startAutoSlide()
}

// Swipe detection logic
const handleSwipe = () => {
  const swipeDistance = touchStartX.value - touchEndX.value

  if (Math.abs(swipeDistance) < minSwipeDistance) {
    return // Not a significant swipe
  }

  if (swipeDistance > 0) {
    // Swiped left, show next slide
    nextSlide()
  } else {
    // Swiped right, show previous slide
    prevSlide()
  }
}

// Audio player functions
const playAudio = async () => {
  if (audioPlayer.value) {
    try {
      console.log('Attempting to play audio...')
      console.log('Audio src:', audioPlayer.value.src)
      console.log('Audio readyState:', audioPlayer.value.readyState)

      await audioPlayer.value.play()
      isPlaying.value = true
      console.log('Audio playing successfully!')
    } catch (error) {
      console.error('Audio play error:', error)
      console.log('Error details:', error.message)

      // Try alternative approach
      audioPlayer.value.load()
      setTimeout(() => {
        audioPlayer.value.play().catch((e) => {
          console.error('Second attempt failed:', e)
          alert(
            'Unable to play audio. This might be due to browser restrictions or file access issues.',
          )
        })
      }, 500)
    }
  } else {
    console.error('Audio player not found')
  }
}

const tryAutoplay = async () => {
  // Try to autoplay after a short delay to allow page to load
  setTimeout(async () => {
    if (audioPlayer.value) {
      console.log('Trying autoplay...')
      try {
        await audioPlayer.value.play()
        isPlaying.value = true
        console.log('Autoplay successful!')
      } catch (error) {
        console.log('Autoplay blocked - user interaction required:', error.message)
      }
    }
  }, 2000)
}

const handleAudioError = (event) => {
  console.error('Audio error event:', event)
  console.log('Audio files not found. Please add your audio file to the public folder.')
  console.log('Expected locations:')
  console.log('- public/audio.mp3')
  console.log('- public/audio.wav')
  console.log('- public/audio.ogg')
}

// Lifecycle
onMounted(() => {
  generateHearts()
  startAutoSlide()
  startCountdown()
  startTypewriter()
  tryAutoplay()
})

onUnmounted(() => {
  stopAutoSlide()
  stopCountdown()
  stopTypewriter()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

/* Falling Hearts */
.hearts-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.falling-heart {
  position: absolute;
  top: -50px;
  font-size: 2rem;
  animation: fall linear infinite;
  opacity: 0.7;
}

@keyframes fall {
  0% {
    transform: translateY(-50px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Main Content */
.main-content {
  position: relative;
  z-index: 2;
  padding: 2rem 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 2.5rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  text-align: center;
  font-weight: bold;
}

/* YouTube Player */
.youtube-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto 2rem auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.youtube-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.audio-player-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.audio-player-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.8), rgba(254, 207, 239, 0.8));
  backdrop-filter: blur(5px);
  z-index: 2;
  border-radius: 12px;
}

.music-icon {
  font-size: 2rem;
  animation: pulse 2s ease-in-out infinite;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.music-icon:hover {
  transform: scale(1.1);
}

.music-icon.playing {
  animation:
    pulse 1s ease-in-out infinite,
    rotate 3s linear infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.music-text {
  color: white;
  text-align: center;
}

.music-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.music-subtitle {
  font-size: 0.8rem;
  opacity: 0.9;
  font-style: italic;
}

.youtube-container iframe {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

/* Carousel */
.carousel-container {
  position: relative;
  width: 100%;
  max-width: 500px; /* Increased from 350px to 500px */
  margin: 0 auto;
}

.carousel {
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  background: white;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  touch-action: pan-y; /* Allow vertical scrolling but handle horizontal swipes */
}

.carousel:active {
  cursor: grabbing;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  position: relative;
}

.photo-frame {
  position: relative;
  width: 100%;
  height: 667px; /* 500px width * 1.333 (4:3 ratio) for 1080x1440 aspect ratio */
  overflow: hidden;
}

.photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none; /* Prevent image from interfering with touch events */
  user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 2rem 1rem 1rem;
  text-align: center;
}

.photo-overlay p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Carousel Indicators */
.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.carousel-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators button.active {
  background: #ff6b9d;
  transform: scale(1.2);
}

/* Countdown Timer */
.countdown-container {
  margin-top: 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.countdown-title {
  color: white;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  font-weight: 600;
}

.countdown-timer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 1rem 0.8rem;
  min-width: 70px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.time-unit:hover {
  transform: translateY(-5px);
}

.time-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ff6b9d;
  line-height: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.time-label {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.3rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Romantic Typewriter Text */
.romantic-text-container {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  position: relative;
}

.typewriter-text {
  font-size: 1.2rem;
  color: white;
  text-align: left;
  line-height: 1.8;
  min-height: 2.5rem;
  font-family: 'Georgia', serif;
  word-wrap: break-word;
  hyphens: auto;
}

.typed-text {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  display: inline;
  word-wrap: break-word;
}

.cursor {
  color: #ff6b9d;
  font-weight: bold;
  font-size: 1.4rem;
  margin-left: 2px;
  animation: none;
  display: inline-block;
}

.cursor.blinking {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

/* Add romantic glow effect */
.romantic-text-container::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #ff6b9d, #fecfef, #ff9a9e, #ff6b9d);
  border-radius: 22px;
  z-index: -1;
  opacity: 0.3;
  /* Remove the spinning animation */
  /* animation: rotate-gradient 3s linear infinite; */
}

/* Keep the keyframes in case you want to re-enable later */
@keyframes rotate-gradient {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Flower Blossom Animation */
.flower-garden {
  position: relative;
  width: 100%;
  height: 200px;
  margin-top: 2rem;
  overflow: hidden;
}

.flower-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.flower {
  position: absolute;
  bottom: 0;
  width: 60px;
  height: 60px;
  animation: bloom ease-in-out forwards;
  transform-origin: center bottom;
}

.flower-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  z-index: 2;
  animation: bloom-center 0.8s ease-out forwards;
}

.petal {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 1.2rem;
  transform-origin: center center;
  animation: bloom-petal 1.2s ease-out forwards;
}

.petal-1 {
  transform: translate(-50%, -50%) rotate(0deg) translateY(-15px);
  animation-delay: 0.1s;
}

.petal-2 {
  transform: translate(-50%, -50%) rotate(60deg) translateY(-15px);
  animation-delay: 0.2s;
}

.petal-3 {
  transform: translate(-50%, -50%) rotate(120deg) translateY(-15px);
  animation-delay: 0.3s;
}

.petal-4 {
  transform: translate(-50%, -50%) rotate(180deg) translateY(-15px);
  animation-delay: 0.4s;
}

.petal-5 {
  transform: translate(-50%, -50%) rotate(240deg) translateY(-15px);
  animation-delay: 0.5s;
}

.petal-6 {
  transform: translate(-50%, -50%) rotate(300deg) translateY(-15px);
  animation-delay: 0.6s;
}

.sparkles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 1rem;
  animation: sparkle-twinkle 2s ease-in-out infinite;
  opacity: 0;
}

@keyframes bloom {
  0% {
    transform: scale(0) translateY(20px);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes bloom-center {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes bloom-petal {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-5px) scale(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-15px) scale(1);
  }
}

@keyframes sparkle-twinkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  25% {
    opacity: 1;
    transform: scale(1) rotate(90deg);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2) rotate(180deg);
  }
  75% {
    opacity: 1;
    transform: scale(1) rotate(270deg);
  }
}

/* Navigation Buttons */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 3;
}

.nav-btn:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
}

.nav-btn.prev {
  left: -60px;
}

.nav-btn.next {
  right: -60px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0.5rem;
  }

  .title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .carousel-container {
    max-width: 450px; /* Increased from 320px to 450px */
  }

  .photo-frame {
    height: 600px; /* 450px width * 1.333 (4:3 ratio) for 1080x1440 aspect ratio */
  }

  .nav-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .nav-btn.prev {
    left: -50px;
  }

  .nav-btn.next {
    right: -50px;
  }

  .falling-heart {
    font-size: 1.5rem;
  }

  .youtube-container {
    max-width: 350px;
    margin-bottom: 1.5rem;
    padding: 0.8rem;
  }

  .music-icon {
    font-size: 1.8rem;
  }

  .music-title {
    font-size: 0.9rem;
  }

  .music-subtitle {
    font-size: 0.7rem;
  }

  .countdown-container {
    margin-top: 1.5rem;
    padding: 1rem;
  }

  .countdown-title {
    font-size: 1.1rem;
  }

  .countdown-timer {
    gap: 0.8rem;
  }

  .time-unit {
    padding: 0.8rem 0.6rem;
    min-width: 60px;
  }

  .time-value {
    font-size: 1.5rem;
  }

  .time-label {
    font-size: 0.8rem;
  }

  .romantic-text-container {
    margin-top: 1.5rem;
    padding: 1.2rem;
  }

  .typewriter-text {
    font-size: 1.1rem;
    line-height: 1.7;
  }

  .cursor {
    font-size: 1.3rem;
  }

  .flower-garden {
    height: 150px;
    margin-top: 1.5rem;
  }

  .flower {
    width: 50px;
    height: 50px;
  }

  .flower-center {
    font-size: 1.3rem;
  }

  .petal {
    font-size: 1rem;
  }

  .sparkle {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 1rem 0.25rem;
  }

  .carousel-container {
    max-width: 350px; /* Increased from 280px to 350px */
  }

  .photo-frame {
    height: 467px; /* 350px width * 1.333 (4:3 ratio) for 1080x1440 aspect ratio */
  }

  .nav-btn.prev {
    left: -25px;
  }

  .nav-btn.next {
    right: -25px;
  }

  .title {
    font-size: 1.8rem;
  }

  .youtube-container {
    max-width: 300px;
    margin-bottom: 1rem;
    padding: 0.6rem;
  }

  .music-icon {
    font-size: 1.5rem;
  }

  .music-title {
    font-size: 0.8rem;
  }

  .music-subtitle {
    font-size: 0.6rem;
  }

  .countdown-container {
    margin-top: 1rem;
    padding: 0.8rem;
  }

  .countdown-title {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }

  .countdown-timer {
    gap: 0.5rem;
  }

  .time-unit {
    padding: 0.6rem 0.4rem;
    min-width: 50px;
  }

  .time-value {
    font-size: 1.3rem;
  }

  .time-label {
    font-size: 0.7rem;
  }

  .romantic-text-container {
    margin-top: 1rem;
    padding: 1rem;
  }

  .typewriter-text {
    font-size: 1rem;
    line-height: 1.6;
  }

  .cursor {
    font-size: 1.2rem;
  }

  .flower-garden {
    height: 120px;
    margin-top: 1rem;
  }

  .flower {
    width: 40px;
    height: 40px;
  }

  .flower-center {
    font-size: 1.1rem;
  }

  .petal {
    font-size: 0.9rem;
  }

  .sparkle {
    font-size: 0.8rem;
  }
}
</style>
