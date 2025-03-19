import OrgListComponent from '@/components/OrgListComponent.vue';
import OrgDetailComponent from '@/components/OrgDetailComponent.vue';

export const orgRoutes = [
  {
    path: '/orgs',
    name: 'OrgList',
    component: OrgListComponent,
  },
  {
    path: '/orgs/:id',
    name: 'OrgDetail',
    component: OrgDetailComponent,
    props: true, // Passe l'id de l'organisation à la props du composant
  },
];
