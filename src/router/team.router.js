import TeamListComponent from '@/components/TeamListComponent.vue';
import TeamDetailComponent from '@/components/TeamDetailComponent.vue';

export const teamRoutes = [
    {
        path: '/teams',
        name: 'TeamList',
        component: TeamListComponent,
    },
    {
        path: '/teams/:id',
        name: 'TeamDetail',
        meta: {guard: 1},
        component: TeamDetailComponent,
        props: true, // Passe l'id de l'équipe à la props du composant
    },
];
