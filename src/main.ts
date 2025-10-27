import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import {store} from './store/horseRacing.js'

const app = createApp(App)
app.use(store)
app.mount('#app')

//this needed for playwright tests
window.store = store
