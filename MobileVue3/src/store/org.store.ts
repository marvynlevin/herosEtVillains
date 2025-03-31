import {defineStore} from 'pinia';
import {getAllOrgs, getOrgById, addTeamToOrg, removeTeamFromOrg, createOrg} from '@/services/org.service';
import {useErrorStore} from './error.store';

interface Organization {
    _id: string;
    name: string;
    teams: string[];
    secret?: string;
}

interface OrganizationDetails {
    _id: string;
    name: string;
    teams: TeamDetails[];
    secret?: string;
}

interface TeamDetails {
    _id: string;
    name: string;
    members: string[];
}

export const useOrgStore = defineStore('org', {
    state: () => ({
        orgs: [] as Organization[],
        currentOrg: null as OrganizationDetails | null,
        orgSecret: null as string | null,
        loading: false,
    }),
    actions: {
        setOrgSecret(secret: string | null) {
            this.orgSecret = secret;
        },
        async fetchOrgs() {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                const orgs = await getAllOrgs();
                this.orgs = orgs;
            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async createOrg(orgData: Omit<Organization, '_id'>) {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                const newOrg = await createOrg(orgData);
                this.orgs.push(newOrg);
                this.currentOrg = newOrg;
                this.orgSecret = orgData.secret ?? null;
            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async addTeamToOrg(teamData: { idTeam: string }) {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                await addTeamToOrg(teamData, this.orgSecret!);
                const updatedOrg = await getOrgById(this.currentOrg!._id, this.orgSecret!);
                this.currentOrg = updatedOrg.data;
            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async removeTeamFromOrg(teamData: { idTeam: string }) {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                await removeTeamFromOrg(teamData, this.orgSecret!);
                const updatedOrg = await getOrgById(this.currentOrg!._id, this.orgSecret!);
                this.currentOrg = updatedOrg.data;
            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async fetchOrgById({id, secret}: { id: string; secret: string }) {
            this.loading = true;
            const errorStore = useErrorStore();
            try {
                const org = await getOrgById(id, secret);
                this.currentOrg = org.data;
                this.orgSecret = secret;
            } catch (error: any) {
                errorStore.setError(error.message);
            } finally {
                this.loading = false;
            }
        },
    },
    getters: {
        getOrgs: (state) => state.orgs,
        getCurrentOrg: (state) => state.currentOrg,
        getOrgSecret: (state) => state.orgSecret,
        isOrgLoading: (state) => state.loading,
    },
});
