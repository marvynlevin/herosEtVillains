import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import HomePage from '../views/HomePage.vue'
import AuthComponent from "@/views/AuthComponent.vue";
import UserAuthComponent from "@/views/UserAuthComponent.vue";
import {orgRoutes} from "@/router/org.router";
import UserRegisterComponent from "@/views/UserRegisterComponent.vue";
import NotFoundComponent from "@/views/NotFoundComponent.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/auth',
        name: 'Auth',
        component: AuthComponent,
    },
    {
        path: '/login',
        name: 'Login',
        component: UserAuthComponent
    },
    {
        path: '/register',
        name: 'Register',
        component: UserRegisterComponent
    },
    ...orgRoutes,
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: NotFoundComponent,
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
