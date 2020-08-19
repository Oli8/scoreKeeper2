import Vue from 'vue';
import VueRouter from 'vue-router';

import Game from '@/components/pages/Game.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/:config?',
    name: 'Game',
    component: Game,
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('@/components/pages/Result.vue'),
    props: true,
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
