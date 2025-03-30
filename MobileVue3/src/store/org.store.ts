import {defineStore} from 'pinia';
import {getAllOrgs, getOrgById, createOrg, addTeamToOrg, removeTeamFromOrg, Org, Team} from "@/services/org.service";
import {useErrorStore} from './error.store';

interface OrgState {
    orgs: Org[];
    currentOrg: Org | null;
    currentOrgSecret: string | null;
    loading: boolean;
}

export const useOrgStore = defineStore('org', {
    state: (): OrgState => ({
        orgs: [],
        currentOrg: null,
        currentOrgSecret: null,
        loading: false,
    }),
    actions: {
        async fetchOrgs() {
            this.loading = true;
            try {
                this.orgs = (await getAllOrgs()).data;
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async createOrg(orgData: Org) {
            this.loading = true;
            try {
                const newOrg = (await createOrg(orgData)).data;
                this.orgs.push(newOrg);
                this.currentOrg = newOrg;
                this.currentOrgSecret = orgData.secret;
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async addTeamToOrg(teamData: Team) {
            this.loading = true;
            try {
                await addTeamToOrg(teamData, this.currentOrgSecret!);
                const updatedOrg = await getOrgById((this.currentOrg! as unknown as Array<any>)[0]._id, this.currentOrgSecret!);
                this.currentOrg = updatedOrg.data;
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async removeTeamFromOrg(teamData: Team) {
            this.loading = true;
            try {
                await removeTeamFromOrg(teamData, this.currentOrgSecret!);
                const updatedOrg = await getOrgById((this.currentOrg! as unknown as Array<any>)[0]._id, this.currentOrgSecret!);
                this.currentOrg = updatedOrg.data;
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },

        async fetchOrgById({id, secret}: { id: string; secret: string }) {
            this.loading = true;
            try {
                const org = await getOrgById(id, secret);
                this.currentOrg = org.data;
                this.currentOrgSecret = secret;
            } catch (error: any) {
                useErrorStore().setError(error.message);
            } finally {
                this.loading = false;
            }
        },
    },
    getters: {
        getOrgs: (state) => state.orgs,
        getCurrentOrg: (state) => state.currentOrg,
        getOrgSecret: (state) => state.currentOrgSecret,
        isOrgLoading: (state) => state.loading,
    },
});