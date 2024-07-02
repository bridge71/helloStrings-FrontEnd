// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui';
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Lara from '@primevue/themes/lara';
import Nora from '@primevue/themes/nora';
import "primeflex/primeflex.css";
const app = createApp(App)

app.use(router)
app.use(naive)
app.use(PrimeVue, {
  theme: {
    preset: Nora,
  }
})
app.mount('#app')

