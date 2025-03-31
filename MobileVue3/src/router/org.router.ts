import OrgListComponent from '@/views/OrgListComponent.vue';
// import OrgDetailComponent from '@/views/OrgDetailComponent.vue';

export const orgRoutes = [
    {
        path: '/orgs',
        name: 'OrgList',
        component: OrgListComponent,
    },
    // {
    //     path: '/orgs/:id',
    //     name: 'OrgDetail',
    //     component: OrgDetailComponent,
    //     meta: {requiresAuth: 1},
    //     props: true, // Passe l'id de l'organisation à la props du composant
    // },
];
