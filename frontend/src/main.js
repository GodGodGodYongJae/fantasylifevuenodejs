// import Vue from 'vue'
// import App from './App.vue'
// import router from './router'
// import store from './store'

// Vue.config.productionTip = false

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import { router } from './routes/index.js'
import axios from 'axios'


// Import Bootstrap and BootstrapVue CSS files (order is important)



Vue.config.productionTip = false

import CharacterCard from './components/charactercard'
import Modal from './components/modal'
import AttackModal from './components/attackmodal'
import imageupload from './components/imageuploadpage'
import "./store/fontAwesomeIcon";

Vue.component(CharacterCard.name, CharacterCard);
Vue.component(Modal.name, Modal);
Vue.component(AttackModal.name, AttackModal);
Vue.component(imageupload.name, imageupload);
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

Vue.prototype.$http = axios;
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')