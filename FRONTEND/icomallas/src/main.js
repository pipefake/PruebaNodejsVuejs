// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/routerVue'; // Adjust the path to match your router file

const app = createApp(App);

app.use(router); // Use the router instance
app.mount('#app');
