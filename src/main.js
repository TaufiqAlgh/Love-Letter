 
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

try {
  const pinia = createPinia()
  const initVueApp = () => {
    createApp(App).use(pinia).mount('#app');
  };

    initVueApp();

} catch (e) {
  console.error(e);
}
