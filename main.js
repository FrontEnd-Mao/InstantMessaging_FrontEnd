import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import io from './components/socket/weapp.socket.io.js'

// Vue.prototype.baseUrl = 'http://localhost:8081'
Vue.config.productionTip = false;
Vue.prototype.apiUrl = 'http://localhost:8081';
Vue.prototype.socket = io('http://localhost:3000');

App.mpType = 'app'
const app = new Vue({
    ...App
}) 
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif