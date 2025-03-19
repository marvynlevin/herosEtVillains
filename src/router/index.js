import Vue from 'vue';
import Router from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NotFoundComponent from '@/components/NotFoundComponent.vue';
import { orgRoutes } from './org.router';
import { teamRoutes } from './team.router';
import AuthComponent from '@/components/AuthComponent.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'Auth',
      component: AuthComponent,
    },
    ...orgRoutes,  // Import des routes liées aux organisations
    ...teamRoutes, // Import des routes liées aux équipes
    {
      path: '*',
      name: '404',
      component: NotFoundComponent,
    },
  ]
});
