import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NotFoundComponent from '@/views/NotFoundComponent.vue';
import {orgRoutes} from './org.router';
import {teamRoutes} from './team.router';
import AuthComponent from '@/views/AuthComponent.vue';
import UserAuthComponent from "@/views/UserAuthComponent.vue";
import HeroAuthUpdateComponent from "@/views/HeroAuthUpdateComponent.vue";
import UserRegisterComponent from "@/views/UserRegisterComponent.vue";
import {useOrgStore} from "@/store/org.store";

const router = createRouter({
    history: createWebHistory(),
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
            path: '/login',
            name: 'Login',
            component: UserAuthComponent
        },
        {
            path: '/updatehero',
            name: 'HeroAuthUpdate',
            component: HeroAuthUpdateComponent
        },
        {
            path: '/register',
            name: 'Register',
            component: UserRegisterComponent
        },
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: NotFoundComponent,
        },
    ]
});

const orgsStore = useOrgStore();

router.beforeEach((to, from, next) => {
    if (to.meta?.requiresAuth) {
        if (orgsStore.currentOrgSecret) {
            next();
        } else {
            next({name: 'Auth'});
        }
    } else if (to.name === 'Auth' && orgsStore.currentOrgSecret) {
        next({name: 'Home'});
    } else {
        next();
    }
});

export default router;