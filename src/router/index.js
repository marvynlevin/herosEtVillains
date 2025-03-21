import Vue from 'vue';
import Router from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NotFoundComponent from '@/components/NotFoundComponent.vue';
import {orgRoutes} from './org.router';
import {teamRoutes} from './team.router';
import AuthComponent from '@/components/AuthComponent.vue';
import store from '@/store';


Vue.use(Router);

const router = new Router({
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
        ...orgRoutes,
        ...teamRoutes,
        {
            path: '*',
            name: '404',
            component: NotFoundComponent,
        },
    ]
});

router.beforeEach((to, from, next) => {
    if (to?.meta?.requiresAuth) {
        if (store.getters['org/getOrgSecret']) {
            next();
        } else {
            next({name: 'Auth'});
        }
    } else if (to.name === 'Auth' && store.getters['org/getOrgSecret']) {
        next({name: 'Home'});
    } else {
        next();
    }
});

export default router;