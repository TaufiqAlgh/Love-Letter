/* eslint-disable no-undef */
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

try {
  const pinia = createPinia()
  const initVueApp = () => {
    createApp(App).use(pinia).mount('#app');
  };

  // dynamic view id
  const allowedViewId = [11229386];

  // cek jika script berjalan di aplikasi kintone
  if (typeof kintone !== 'undefined') {
    // run aplikasi vue jika kintone app sudah terload semua
    kintone.events.on(['app.record.index.show', 'mobile.app.record.index.show'], (event) => {
      // pastikan hanya jalan pada view id yang di inginkan
      if (!event.viewId || !allowedViewId.includes(Number(event.viewId))) return event;
      initVueApp();
      return event;
    });


    kintone.events.on(['app.record.detail.show', 'mobile.app.record.detail.show'], (e) => {
      if (e.type === 'mobile.app.record.detail.show') {
        const headerElement = document.querySelector('.gaia-mobile-v2-viewpanel-globalnavigationbar')
        headerElement.style.backgroundColor = 'royalblue'

        $('*').css('font-family', 'sans-serif');
      }




      return e
    })
  } else {
    initVueApp();
    console.log(`kintone view not run`);
  }
} catch (e) {
  console.error(e);
}
