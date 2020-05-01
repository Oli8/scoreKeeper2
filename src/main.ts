import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import App from './App.vue';
import router from './router';

import { eventData } from '@/structs/logEvents';

Vue.use(Buefy, {
  defaultIconPack: 'fas',
});

Vue.mixin({
  methods: {
    emitLogEvent(event: eventData): void {
      this.$root.$emit('log-event', event);
    },
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
