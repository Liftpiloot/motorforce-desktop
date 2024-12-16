import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "../router";

function getUserFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const user = params.get('user');
    return user ? JSON.parse(decodeURIComponent(user)) : null;
}

const user = getUserFromUrl();
if (user) {
    localStorage.setItem('user', JSON.stringify(user));
}
window.history.replaceState({}, document.title, '/');

createApp(App).use(router).mount('#app')
