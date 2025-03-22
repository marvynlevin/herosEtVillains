import TeamListComponent from '@/views/TeamListComponent.vue';
import TeamDetailComponent from '@/views/TeamDetailComponent.vue';

export const teamRoutes = [
    {
        path: '/teams',
        name: 'TeamList',
        component: TeamListComponent,
    },
    {
        path: '/teams/:id',
        name: 'TeamDetail',
        meta: {requiresAuth: 1},
        component: TeamDetailComponent,
        props: true, // Passe l'id de l'équipe à la props du composant
    },
];
