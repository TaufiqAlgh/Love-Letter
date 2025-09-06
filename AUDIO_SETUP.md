# Audio Setup Instructions

## How to Add Your Audio File

### Option 1: Public Directory (Easiest)

1. Copy your audio file to: `public/audio.mp3`
2. The app will automatically use it

### Option 2: Custom Filename

If your file has a different name, update the audio sources in welcome-page.vue:

```html
<source src="/your-filename.mp3" type="audio/mpeg" />
```

### File Formats Supported

- MP3 (recommended)
- WAV
- OGG

### Current File Paths Being Checked

The app will try to load audio from these locations in order:

1. `/src/assets/audio.mp3`
2. `/src/assets/audio.wav`
3. `/src/assets/audio.ogg`
4. `/audio.mp3`
5. `/audio.wav`

### Testing

1. Add your audio file
2. Refresh the page
3. Click the music player
4. Check browser console for any errors
